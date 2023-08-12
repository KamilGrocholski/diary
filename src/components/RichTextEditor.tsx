import dynamic from "next/dynamic"
import { useState } from "react"
import type ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <div>Loading...</div>,
})

export default function RichTextEditor() {
    const [value, setValue] = useState<ReactQuill.Value | undefined>(undefined)

    return <QuillNoSSRWrapper theme="snow" value={value} onChange={setValue} />
}
