"use client"

import { useEffect, useState, type ComponentType } from "react"
import "./ckeditor.css"

type Props = {
  value: string
  onChange: (value: string) => void
}

export function ClientCKEditor({ value, onChange }: Props) {
  const [Editor, setEditor] = useState<ComponentType<any> | null>(null)
  const [Classic, setClassic] = useState<any>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    let mounted = true
    Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("@ckeditor/ckeditor5-build-classic"),
    ]).then(([reactModule, classicModule]) => {
      if (!mounted) return
      setEditor(() => reactModule.CKEditor)
      setClassic(() => classicModule.default)
    })
    return () => {
      mounted = false
    }
  }, [])

  if (!Editor || !Classic) {
    return <div className="h-32 rounded-md border bg-muted animate-pulse" />
  }

  return (
    <Editor
      editor={Classic}
      data={value}
      onChange={(_evt: unknown, editor: { getData: () => string }) => {
        onChange(editor.getData())
      }}
    />
  )
}
