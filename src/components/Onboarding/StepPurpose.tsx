interface StepPurposeProps {
    purpose: string[]
    onUpdate: (purpose: string[]) => void
}

const purposes = [
    { value: "INTERVIEW_PREP", label: "Interview Preparation" },
    { value: "SKILL_ASSESSMENT", label: "Skill Assessment" },
    { value: "LEARNING", label: "Learning New Topics" },
    { value: "PRACTICE", label: "Regular Practice" },
    { value: "COMPETITION", label: "Competitive Programming" }
]

export default function StepPurpose({ purpose, onUpdate }: StepPurposeProps) {
    const togglePurpose = (value: string) => {
        if (purpose.includes(value)) {
            onUpdate(purpose.filter((p) => p !== value))
        } else {
            onUpdate([...purpose, value])
        }
    }

    return (
        <div className='space-y-4'>
            <div>
                <h2 className='text-2xl font-bold mb-2'>Why are you here?</h2>
                <p className='text-gray-600'>Select all that apply</p>
            </div>

            <div className='space-y-3'>
                {purposes.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => togglePurpose(opt.value)}
                        className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                            purpose.includes(opt.value)
                                ? "border-black bg-gray-100"
                                : "border-gray-300 hover:border-gray-400"
                        }`}>
                        <div className='flex items-center justify-between'>
                            <span className='font-medium'>{opt.label}</span>
                            {purpose.includes(opt.value) && (
                                <svg
                                    className='w-5 h-5'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M5 13l4 4L19 7'
                                    />
                                </svg>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <p className='text-sm text-gray-500 mt-4'>
                Select at least one option
            </p>
        </div>
    )
}
