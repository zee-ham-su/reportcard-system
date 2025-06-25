import Link from 'next/link';
import { useState } from 'react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-foreground text-background">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link href="/">ReportCard</Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link href="/students">Students</Link>
          <Link href="/classes">Classes</Link>
          <Link href="/subjects">Subjects</Link>
          <Link href="/marks">Marks</Link>
          <Link href="/teachers">Teachers</Link>
          <Link href="/reports">Reports</Link>
          <Link href="/users">Users</Link>
          <Link href="/auth/login">Login</Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            Menu
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-foreground">
          <Link href="/students" className="block p-2">Students</Link>
          <Link href="/classes" className="block p-2">Classes</Link>
          <Link href="/subjects" className="block p-2">Subjects</Link>
          <Link href="/marks" className="block p-2">Marks</Link>
          <Link href="/teachers" className="block p-2">Teachers</Link>
          <Link href="/reports" className="block p-2">Reports</Link>
          <Link href="/users" className="block p-2">Users</Link>
          <Link href="/auth/login" className="block p-2">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
