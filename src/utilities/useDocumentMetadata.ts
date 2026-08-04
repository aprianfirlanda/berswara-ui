import { useEffect } from 'react'

interface DocumentMetadataOptions {
  title: string
  robots?: string
}

export function useDocumentMetadata({
  title,
  robots,
}: DocumentMetadataOptions) {
  useEffect(() => {
    const previousTitle = document.title
    const existingRobots = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    )
    const previousRobots = existingRobots?.content
    const robotsMeta = existingRobots ?? document.createElement('meta')
    const createdRobotsMeta = !existingRobots

    document.title = title

    if (robots) {
      robotsMeta.name = 'robots'
      robotsMeta.content = robots

      if (createdRobotsMeta) {
        document.head.append(robotsMeta)
      }
    }

    return () => {
      document.title = previousTitle

      if (!robots) return

      if (createdRobotsMeta) {
        robotsMeta.remove()
      } else if (previousRobots !== undefined) {
        robotsMeta.content = previousRobots
      }
    }
  }, [robots, title])
}
