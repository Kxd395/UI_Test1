import { NextRequest, NextResponse } from 'next/server';
    import { openai } from 'ai';
    import { pool } from '@/lib/db'; // Postgres connection pool

    export async function POST(req: NextRequest) {
      const { query, filters } = await req.json();

      // Construct SQL query with filters
      const sqlQuery = `
        SELECT * FROM your_table
        WHERE column1 = $1 AND column2 = $2
        ORDER BY date DESC
      `;
      const dbResults = await pool.query(sqlQuery, [filters.value1, filters.value2]);

      // Embed results into LLM prompt
      const prompt = `
        Based on the following database results, answer the user's query:
        ${JSON.stringify(dbResults.rows)}
        Query: ${query}
      `;

      const response = await openai.completions.create({
        model: 'gpt-3.5-turbo',
        prompt,
        stream: true,
      });

      return new Response(response.body, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }
