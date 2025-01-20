"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import { ThemeSwitchButton } from "./ThemeSwitchButton";
import { Bell } from "lucide-react"; // Import the notification bell icon

const TopBar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { user } = useUser();

  return (
    <div
      className={`fixed top-0 bg-background border border-b-muted-foreground shadow-sm p-4 flex justify-between items-center transition-all duration-300 ${
        isOpen ? "left-64" : "left-20"
      } right-0`}
    >
      <div className="flex items-center">
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-foreground">
            {user?.firstName
              ? `Welcome, ${user.firstName}! 👋🏾`
              : "Hello Guest 👋🏾"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Your finances, simplified and under control.
          </p>
        </div>
      </div>
      <div className="flex items-center mr-10 cursor-pointer gap-4">
        <button className="p-2 rounded-full hover:bg-muted transition-all">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Theme Switch Button */}
        <ThemeSwitchButton />

        {/* User Button */}
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  );
};

export default TopBar;
