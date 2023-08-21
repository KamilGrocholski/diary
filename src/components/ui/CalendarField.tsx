import { type ButtonHTMLAttributes, forwardRef } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export type CalendarFieldProps = {
    value: Date
    onChange: (date: Date) => void
}
type CustomInputProps = ButtonHTMLAttributes<HTMLButtonElement>

const CalendarInput = forwardRef<HTMLButtonElement, CustomInputProps>(
    ({ value, onClick }, ref) => (
        <div className="flex flex-col">
            <span>Date</span>
            <button
                type="button"
                className="px-2 py-1.5 border border-rosePine-highlightHigh bg-rosePine-surface text-rosePine-text"
                onClick={onClick}
                ref={ref}
            >
                {value}
            </button>
        </div>
    )
)
CalendarInput.displayName = "CalendarInput"

const CalendarField = forwardRef<HTMLButtonElement, CalendarFieldProps>(
    (props, ref) => {
        const { onChange, value } = props

        return (
            <DatePicker
                selected={value}
                onChange={onChange}
                customInput={<CalendarInput ref={ref} />}
            />
        )
    }
)

CalendarField.displayName = "CalendarField"

export default CalendarField
