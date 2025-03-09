'use server'
import { db } from '@/lib/db'

export async function getAllowRegisterSettings() {
  const appSettings = await db.appSetting.findUnique({
    where: {
      name: 'allowRegister',
    },
  })

  return appSettings
}
