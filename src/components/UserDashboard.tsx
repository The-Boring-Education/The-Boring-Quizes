import { useAuth } from "../contexts/AuthContext"
import { User as UserIcon, X } from "lucide-react"

export default function UserDashboard({ onClose }: { onClose: () => void }) {
    const { user } = useAuth()

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-2xl max-w-md w-full'>
                <div className='p-6 border-b'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-2xl font-bold'>Your Profile</h2>
                        <button
                            onClick={onClose}
                            className='text-gray-500 hover:text-gray-700'>
                            <X className='w-6 h-6' />
                        </button>
                    </div>
                </div>

                <div className='p-6'>
                    {/* User Info */}
                    <div className='flex items-center space-x-4 mb-6'>
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className='w-20 h-20 rounded-full'
                            />
                        ) : (
                            <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center'>
                                <UserIcon className='w-10 h-10 text-gray-500' />
                            </div>
                        )}
                        <div>
                            <h3 className='text-xl font-semibold'>
                                {user?.name}
                            </h3>
                            <p className='text-gray-600'>{user?.email}</p>
                            {user?.userName && (
                                <p className='text-sm text-gray-500'>
                                    @{user.userName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* User Details */}
                    <div className='space-y-4'>
                        {user?.occupation && (
                            <div>
                                <p className='text-sm text-gray-500'>
                                    Occupation
                                </p>
                                <p className='font-medium'>{user.occupation}</p>
                            </div>
                        )}

                        {user?.purpose && user.purpose.length > 0 && (
                            <div>
                                <p className='text-sm text-gray-500'>
                                    Using Quizes for
                                </p>
                                <div className='flex flex-wrap gap-2 mt-1'>
                                    {user.purpose.map((p) => (
                                        <span
                                            key={p}
                                            className='px-3 py-1 bg-gray-100 rounded-full text-sm'>
                                            {p.replace(/_/g, " ").toLowerCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                        <p className='text-sm text-gray-600 text-center'>
                            Quiz history and statistics coming soon!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
