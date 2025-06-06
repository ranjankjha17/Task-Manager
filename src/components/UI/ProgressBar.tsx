export default function ProgressBar({ value }: { value: number }) {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    )
  }