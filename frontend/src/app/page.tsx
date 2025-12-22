import Image from "next/image";

export default function Home() {
  return (
    <div>
      {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={`h-48 mb-4 ${
                i % 2 === 0 ? "bg-red-300" : "bg-green-300"
              } flex items-center justify-center`}
            >
              Content {i + 1}
            </div>
          ))}
    </div>
  );
}
