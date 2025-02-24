'use client'

import { useQuery } from '@tanstack/react-query'
import { getModels } from '@/app/actions/models/getModels'
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Model } from '@prisma/client'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export function AgentModelFormItem({ models }: { models: Model[] }) {
  const form = useFormContext()
  const { control } = form

  function getModelCredits(modelId: number) {
    const model = models.find((model) => model.id === modelId)
    return model?.credits
  }

  return (
    <FormField
      control={control}
      name='model'
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <div className='flex items-center gap-1'>
              Model<span className='text-xs text-red-500'>*</span>
            </div>
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a model' />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    <div className='flex items-center gap-2'>
                      {model.name}{' '}
                      <div className='text-[8px] text-muted-foreground bg-primary/10 px-2 rounded-md font-medium'>
                        {model.credits} credits / request
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            The model to use for the agent, this will be used to generate the
            agent's response.{' '}
            {form.getValues('model') && (
              <span className='font-bold px-2 bg-primary/10 rounded'>
                {getModelCredits(form.getValues('model'))} credits / request
              </span>
            )}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
