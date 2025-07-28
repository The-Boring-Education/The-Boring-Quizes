import { useQuery } from "@tanstack/react-query"
import { quizApi } from "../services/api"
import { QuizCategory } from "../types/quiz"
import { QuizCategoryAPI } from "../types/api"

interface CategorySelectionProps {
    onSelectCategory: (category: QuizCategory) => void
}

export default function CategorySelection({
    onSelectCategory
}: CategorySelectionProps) {
    const {
        data: categoriesData,
        isLoading,
        error
    } = useQuery({
        queryKey: ["quiz-categories"],
        queryFn: () => quizApi.getCategories()
    })

    const categories = categoriesData?.data?.data || []

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>
                    Loading categories...
                </div>
            </div>
        )
    }

    if (error || categories.length === 0) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold text-red-600'>
                    Failed to load categories. Please try again.
                </div>
            </div>
        )
    }

    // Map API categories to QuizCategory format
    const transformedCategories: QuizCategory[] = categories.map(
        (cat: QuizCategoryAPI) => ({
            id: cat.categoryId,
            name: cat.categoryName,
            description: cat.categoryDescription,
            icon: cat.categoryIcon,
            questions: [], // Will be loaded when category is selected
            color: "blue" // Default color
        })
    )

    return (
        <div className='min-h-screen flex flex-col justify-center items-center bg-white text-black p-4'>
            <div className='w-full max-w-2xl mx-auto flex flex-col items-center'>
                <div className='text-3xl font-extrabold mb-10 text-center'>
                    Choose a Quiz
                </div>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
                    {transformedCategories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => onSelectCategory(cat)}
                            className={
                                "cursor-pointer rounded-xl border-2 p-6 shadow transition-all duration-150 flex flex-col items-start justify-between h-full border-black bg-white hover:bg-red-50 hover:border-red-600"
                            }>
                            <div className='text-xl font-bold mb-2'>
                                {cat.name}
                            </div>
                            <div className='text-sm text-gray-700 mb-2 flex-1'>
                                {cat.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
