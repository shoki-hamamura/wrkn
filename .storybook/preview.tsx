import type { DecoratorFunction } from '@storybook/csf'
import type { Preview, ReactRenderer } from '@storybook/nextjs-vite'
import { ThemeProvider } from 'next-themes'
import '../src/app/globals.css'

const withThemeProvider: DecoratorFunction<ReactRenderer> = (Story) => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <Story />
  </ThemeProvider>
)

const preview: Preview = {
  decorators: [withThemeProvider],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
