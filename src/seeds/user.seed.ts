import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB_NAME,
  entities: [User],
  synchronize: true,
});

export default async function seed() {
  try {
    await AppDataSource.initialize();

    const users = [
      {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
        role: 'recepicionist',
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        password: 'password456',
        role: 'admin',
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const userRepository = AppDataSource.getRepository(User);
      await userRepository.save({ ...user, password: hashedPassword });
    }

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}
