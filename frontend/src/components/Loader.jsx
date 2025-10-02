export default function Loader() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-3">
                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                {/* Text */}
                <p className="text-lg font-semibold text-gray-700">Loading...</p>
            </div>
        </div>
    );
}
