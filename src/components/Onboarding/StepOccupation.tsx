interface StepOccupationProps {
    occupation: string
    onUpdate: (occupation: string) => void
}

const occupations = [
    { value: "STUDENT", label: "Student" },
    { value: "ENGINEER", label: "Software Engineer" },
    { value: "FRESHER", label: "Fresher/Recent Graduate" },
    { value: "PROFESSIONAL", label: "Working Professional" },
    { value: "OTHER", label: "Other" }
]

export default function StepOccupation({
    occupation,
    onUpdate
}: StepOccupationProps) {
    return (
        <div className='space-y-4'>
            <div>
                <h2 className='text-2xl font-bold mb-2'>
                    What best describes you?
                </h2>
                <p className='text-gray-600'>
                    This helps us personalize your experience
                </p>
            </div>

            <div className='space-y-3'>
                {occupations.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onUpdate(opt.value)}
                        className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                            occupation === opt.value
                                ? "border-black bg-gray-100"
                                : "border-gray-300 hover:border-gray-400"
                        }`}>
                        <div className='font-medium'>{opt.label}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}
