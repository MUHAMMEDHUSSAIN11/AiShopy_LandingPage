type ErrorMessageProps = {
  title: string
  message: string
  action?: React.ReactNode
}

export default function ErrorMessage({ title, message, action }: ErrorMessageProps) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
      <h2 className="text-xl font-bold text-red-800">{title}</h2>
      <p className="mt-2 text-sm text-red-600">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
