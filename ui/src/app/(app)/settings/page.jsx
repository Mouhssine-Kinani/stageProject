"use client";

function SettingPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Account Settings
          </h2>
          <div className="border-t pt-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to logout from your account?
            </p>
            <button
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              onClick={() => {
                // Add logout logic here
                console.log("Logging out...");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
