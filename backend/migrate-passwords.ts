import { database } from "./database.ts"
import bcrypt from "bcryptjs"

async function migratePasswords() {
  try {
    const res = await database.query("SELECT user_id, user_password FROM users")
    const users = res.rows

    console.log(`Found ${users.length} users to migrate`)

    let migrated = 0
    let skipped = 0

    for (const user of users) {
      // bcrypt hashes start with "$2a$" or "$2b$" — skip already hashed passwords
      if (
        user.user_password.startsWith("$2a$") ||
        user.user_password.startsWith("$2b$")
      ) {
        console.log(`User ${user.user_id}: already hashed, skipping`)
        skipped++
        continue
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(user.user_password, salt)

      await database.query(
        "UPDATE users SET user_password = $1 WHERE user_id = $2",
        [hashedPassword, user.user_id]
      )

      console.log(`User ${user.user_id}: password hashed successfully`)
      migrated++
    }

    console.log(
      `\nMigration complete: ${migrated} migrated, ${skipped} skipped`
    )
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await database.end()
    process.exit(0)
  }
}

migratePasswords()
