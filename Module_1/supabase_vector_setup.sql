-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Add a vector column to the existing products table
-- We use 3072 dimensions because that is the default output size of the latest Gemini embedding models
-- Note: We drop and recreate it to ensure the dimension is exactly 3072 if it was previously set to 768
alter table products drop column if exists text_embedding;
alter table products add column text_embedding vector(3072);

-- Create a function to find similar products using cosine distance
create or replace function match_products (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id text,
  generated_meta jsonb,
  similarity float
)
language sql stable
as $$
  select
    products.id,
    products.generated_meta,
    1 - (products.text_embedding <=> query_embedding) as similarity
  from products
  where 1 - (products.text_embedding <=> query_embedding) > match_threshold
  order by products.text_embedding <=> query_embedding
  limit match_count;
$$;
