import dynamic from "next/dynamic"
import { type Dispatch, type SetStateAction } from "react"
import type ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <div>Loading...</div>,
})

export default function RichTextEditor(props: {
    value: ReactQuill.Value | undefined
    setValue: Dispatch<SetStateAction<ReactQuill.Value | undefined>>
}) {
    return (
        <QuillNoSSRWrapper
            theme="snow"
            value={props.value}
            onChange={props.setValue}
        />
    )
}
