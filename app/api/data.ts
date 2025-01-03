import { pool } from '@/lib/db';

    function buildQuery(filters) {
      let query = 'SELECT * FROM services WHERE 1=1';

      if (filters.serviceTypes?.length) {
        query += ` AND service_type IN (${filters.serviceTypes.map((type) => `'${type}'`).join(', ')})`;
      }

      if (filters.medicationTypes.methadone?.length) {
        query += ` AND methadone_type IN (${filters.medicationTypes.methadone.map((type) => `'${type}'`).join(', ')})`;
      }

      if (filters.location.zipCode) {
        query += ` AND zip_code = '${filters.location.zipCode}'`;
      }

      if (filters.radius) {
        query += ` AND radius <= ${filters.radius}`;
      }

      return query;
    }

    export default async function handler(req, res) {
      if (req.method === 'POST') {
        const filters = req.body;
        const query = buildQuery(filters);

        try {
          const result = await pool.query(query);
          res.status(200).json(result.rows);
        } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    }
