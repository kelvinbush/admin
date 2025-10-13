"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInForm() {
  return (
    <div className="w-full h-full flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
        {/* Left Side - Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-medium text-white leading-tight">
                Welcome Back
              </h1>
              <p className="text-xl text-white/80 max-w-md">
                Access your admin dashboard
              </p>
            </div>
          </div>

          <div className="space-y-4 text-white/70">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#00B67C] rounded-full"></div>
              <span>Manage loan applications</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#8AF2F2] rounded-full"></div>
              <span>Track user analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#54DDBB] rounded-full"></div>
              <span>Monitor system performance</span>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-white rounded-2xl shadow-none p-8 border border-gray-100",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border-gray-200 hover:border-[#00B67C] hover:bg-[#00B67C]/5 transition-all duration-200 bg-gray-50",
                  socialButtonsBlockButtonText: "text-gray-700 font-medium",
                  formButtonPrimary:
                    "bg-[#00B67C] hover:bg-[#00B67C]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
                  formFieldInput:
                    "border-gray-200 focus:border-[#00B67C] focus:ring-[#00B67C]/20 rounded-lg py-3 px-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500",
                  formFieldLabel: "text-gray-700 font-medium mb-2",
                  footerActionLink:
                    "text-[#00B67C] hover:text-[#00B67C]/80 font-medium transition-colors duration-200",
                  identityPreviewText: "text-gray-600",
                  formHeaderTitle: "text-2xl font-bold text-gray-900 mb-2",
                  formHeaderSubtitle: "text-gray-600 mb-6",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-sm",
                  formResendCodeLink:
                    "text-[#00B67C] hover:text-[#00B67C]/80 font-medium",
                  otpCodeFieldInput:
                    "border-gray-200 focus:border-[#00B67C] focus:ring-[#00B67C]/20 rounded-lg bg-white text-gray-900",
                  formFieldErrorText: "text-red-500 text-sm mt-1",
                  alertText:
                    "text-red-600 bg-red-50 border border-red-200 rounded-lg p-3",
                  formFieldSuccessText: "text-green-600 text-sm mt-1",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
