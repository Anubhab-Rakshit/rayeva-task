import { Request, Response, NextFunction } from 'express';
import { proposalAiService } from '../services/proposalAiService';
import { proposalProcessingService } from '../services/proposalProcessingService';
import { validateProposalData } from '../validators/proposalAjvSchema';
import { ProposalInput } from '../interfaces/models';
import { logger } from '../utils/logger';
import { supabase } from '../database/supabaseClient';

export class ProposalController {
    public async generateProposal(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: ProposalInput = req.body;

            if (!input.company_name || !input.industry || !input.budget_per_unit_inr || !input.total_units || !input.occasion) {
                res.status(400).json({ error: "Missing required fields." });
                return;
            }

            logger.info(`--- Starting proposal generation for ${input.company_name} ---`);

            // 1. LLM Step
            const llmResult = await proposalAiService.generateProposal(input);
            let rawProposal = llmResult.response;
            logger.debug("1. LLM Generation complete.");

            // 2. Validate with AJV BEFORE adding business logic properties
            // AJV schema has additionalProperties: false, so it will fail if we add needs_revision/score first.
            const validation = validateProposalData(rawProposal);
            logger.debug(`2. AJV Validation passed: ${validation.valid}`);

            // 3. Business Logic / Processing
            const enrichedProposal = proposalProcessingService.evaluateProposal(input, rawProposal);
            logger.debug("3. Business Rules executed.");

            if (!validation.valid) {
                logger.error("Schema errors:", validation.errors);
                enrichedProposal.needs_revision = true;
                if (!enrichedProposal.warnings) enrichedProposal.warnings = [];
                enrichedProposal.warnings.push("Schema validation failed");
            }

            // 4. Store in Database
            if (supabase) {
                const { error } = await supabase.from('module2_proposals').insert([{
                    id: enrichedProposal.proposal_id,
                    client_summary: enrichedProposal.client_summary,
                    proposal_data: enrichedProposal as any,
                    quality_score: enrichedProposal.proposal_quality_score
                }]);

                if (error) {
                    logger.error(`[Supabase] Error saving proposal ${enrichedProposal.proposal_id}:`, error);
                }

                await supabase.from('ai_logs').insert([{
                    id: `log_prop_${Date.now()}`,
                    product_id: enrichedProposal.proposal_id,
                    module: "module2_proposal_generator",
                    prompt: llmResult.prompt,
                    response: enrichedProposal as any,
                    model: llmResult.model,
                    validated: validation.valid
                }]);
            }

            logger.debug("4. Pipeline Complete.");

            res.status(200).json({
                success: true,
                data: enrichedProposal,
                validation: validation.valid ? "passed" : "failed"
            });

        } catch (error) {
            logger.error(`Pipeline Error processing proposal:`, error);
            next(error);
        }
    }
    public async refineProposal(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { currentProposal, instruction, input } = req.body;
            
            if (!currentProposal || !instruction || !input) {
                res.status(400).json({ error: "Missing required fields: currentProposal, instruction, input" });
                return;
            }

            logger.info(`--- Starting AI Refinement for ${currentProposal.proposal_id} ---`);
            const llmResult = await proposalAiService.refineWithAi(currentProposal, instruction);
            const rawProposal = llmResult.response;

            const validation = validateProposalData(rawProposal);
            
            const enrichedProposal = proposalProcessingService.evaluateProposal(input, rawProposal);
            if (!validation.valid) {
                enrichedProposal.needs_revision = true;
                if (!enrichedProposal.warnings) enrichedProposal.warnings = [];
                enrichedProposal.warnings.push("Schema validation failed during refinement");
            }

            // Could also log this to Supabase if desired, but for now just returning the new state
            
            res.status(200).json({ success: true, data: enrichedProposal, validation: validation.valid ? "passed" : "failed" });
        } catch (error) {
            logger.error(`Error in refinement pipeline:`, error);
            next(error);
        }
    }
}

export const proposalController = new ProposalController();
