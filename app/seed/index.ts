import { seedUser, seedFile, seedAgent, seedAgentTool } from './user'
import { seedModel } from './model'

export const seedDatabase = async () => {
  await seedUser()
  await seedModel()
  await seedFile()
  await seedAgent()
  await seedAgentTool()
}
