import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#FF5F00' },
        secondary: { value: '#30446F' },
        background: { value: '#FFFFFF' },
      }
    }
  }
})

export const system = createSystem(defaultConfig, customConfig)