import { Injectable, ConflictException, Inject } from '@nestjs/common'
import { Pool } from 'pg'
import { userDto } from './user.dto'
import * as bcrypt from 'bcrypt'
const saltLength = 9
@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool
  ) {}

  async create(user: userDto) {
		console.log('create user', user)

    const client = await this.pool.connect()
    
    try {
      // 檢查郵箱是否存在
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [user.email]
      )

      if (existingUser.rows.length) {
        throw new ConflictException('Email already exists')
      }

      // 創建新用戶
      const hashedPassword = await bcrypt.hash(user.password, saltLength)
      const result = await client.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [user.email, hashedPassword]
      )

      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async findByEmail(email: string) {
    const client = await this.pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }
}
