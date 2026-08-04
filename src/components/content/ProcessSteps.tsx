export interface ProcessStepItem {
  title: string
  description: string
}

export interface ProcessStepsProps {
  steps: readonly ProcessStepItem[]
  heading?: string
}

export function ProcessSteps({
  steps,
  heading = 'Tahapan sewa',
}: ProcessStepsProps) {
  return (
    <section className="process-steps" aria-label={heading}>
      <ol>
        {steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className="process-step-card">
            <span className="process-step-number" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
