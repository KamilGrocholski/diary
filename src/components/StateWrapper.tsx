import Spinner from "./ui/Spinner"

export type StateWrapperProps<T> = {
    isLoading: boolean
    isError: boolean
    isEmpty?: boolean
    data: T
    NonEmpty: (data: NonNullable<T>) => JSX.Element
    Empty?: React.ReactNode
    Loading?: React.ReactNode
    Error?: React.ReactNode
}

const StateWrapper = <T,>({
    isLoading,
    isError,
    isEmpty,
    data,
    NonEmpty,
    Empty = DefaultEmpty,
    Loading = DefaultLoading,
    Error = DefaultError,
}: StateWrapperProps<T>) => {
    if (isLoading) return <>{Loading}</>

    if (isError) return <>{Error}</>

    if (isEmpty) return <>{Empty}</>

    if (Array.isArray(data) && data.length <= 0) return <>{Empty}</>

    if (data === undefined || data === null) return <>{Empty}</>
    return NonEmpty(data)
}

export default StateWrapper

const DefaultLoading = (
    <div>
        <Spinner />
    </div>
)
const DefaultError = <div>Error</div>
const DefaultEmpty = <div>Empty</div>
