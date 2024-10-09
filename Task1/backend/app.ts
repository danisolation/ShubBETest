import express from 'express';
import apiRoutes from './routes/apiRoutes';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
