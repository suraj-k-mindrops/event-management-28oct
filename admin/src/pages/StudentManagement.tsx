import { useState, useMemo } from "react";
import { User, Search, ChevronRight, Calendar, Package, Award, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface DirectoryEntry {
  organizerName: string;
}

interface EventPackage {
  organizerName: string;
}

export default function StudentManagement() {
  const navigate = useNavigate();
  
  // Fetch students from API
  const { data: studentsResponse, isLoading, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      return apiClient.getStudents();
    },
  });

  // Set up refetch interval to check for updates every 10 seconds
  useQuery({
    queryKey: ['students-refresh'],
    queryFn: async () => {
      await refetch();
      return true;
    },
    refetchInterval: 10000, // 10 seconds
  });

  // Extract student data from API response
  const students = studentsResponse?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.organisation?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  }, [students, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calculate totals
  const totalDirectoryEvents = useMemo(() => 
    students.reduce((sum, s) => sum + (s.directoryCount || 0), 0),
    [students]
  );

  const totalPackageEvents = useMemo(() => 
    students.reduce((sum, s) => sum + (s.packageCount || 0), 0),
    [students]
  );

  const activeStudents = students.filter(s => s.status === 'ACTIVE').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage students and their event portfolios
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Total Students</p>
                <p className="text-2xl font-bold text-foreground mt-1">{students.length}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Active Students</p>
                <p className="text-2xl font-bold text-foreground mt-1">{activeStudents}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Directory Events</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalDirectoryEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Package Events</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalPackageEvents}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, phone, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No students found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedStudents.map((student) => (
            <Card 
              key={student.id} 
              className="border border-border bg-card hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(`/students/${student.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground">{student.name}</h3>
                      <p className="text-xs text-muted-foreground">{student.organisation || "No Department"}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-semibold ${
                    student.status === "ACTIVE" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {student.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span>{student.phone || "N/A"}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 rounded p-2">
                      <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{student.directoryCount || 0}</p>
                      <p className="text-[10px] text-muted-foreground">Directory</p>
                    </div>
                    <div className="bg-green-50 rounded p-2">
                      <Package className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{student.packageCount || 0}</p>
                      <p className="text-[10px] text-muted-foreground">Packages</p>
                    </div>
                    <div className="bg-purple-50 rounded p-2">
                      <Award className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{student.totalCount || 0}</p>
                      <p className="text-[10px] text-muted-foreground">Total</p>
                    </div>
                  </div>
                </div>

                {student.portfolioLink && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <a
                      href={student.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      View Portfolio →
                    </a>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 hover:bg-primary hover:text-white transition-all text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/students/${student.id}`);
                  }}
                >
                  View Details
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
