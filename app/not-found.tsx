export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">
        The page you are looking for does not exist.
      </p>
      <a href="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
        Go Back to Home
      </a>
    </div>
  );
}
