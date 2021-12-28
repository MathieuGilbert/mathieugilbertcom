declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hometown-page': BaseProps & HometownMFEProps
    }
  }
}

type BaseProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>

export interface HometownMFEProps {
  country?: string
  stateProv?: string
  city?: string
}
