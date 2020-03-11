import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceEndpoints } from '../types/api-endpoints';
import { InstructorPrivilege, JoinState, SearchStudent, SearchStudentsResult  } from '../types/api-output';
import { HttpRequestService } from './http-request.service';

/**
 * Handles the logic for search.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private httpRequestService: HttpRequestService) {}

  searchInstructor(searchKey: string): Observable<InstructorSearchResult> {
    return this.getStudents(searchKey).pipe(
      map((studentsRes: SearchStudentsResult): InstructorSearchResultCourse[] =>
        this.getCoursesWithSections(studentsRes),
      ),
      map(
        (
          coursesWithSections: InstructorSearchResultCourse[],
        ): InstructorSearchResult => this.getPrivileges(coursesWithSections),
      ),
    );
  }

  private getStudents(searchKey: string): Observable<SearchStudentsResult> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/students', paramMap);
  }

  private getCoursesWithSections(
    studentsRes: SearchStudentsResult,
  ): InstructorSearchResultCourse[] {
    const { students }: { students: SearchStudent[] } = studentsRes;

    const distinctCourses: string[] = Array.from(
      new Set(students.map((s: SearchStudent) => s.courseId)),
    );
    const coursesWithSections: InstructorSearchResultCourse[] = distinctCourses.map(
      (courseId: string) => ({
        courseId,
        sections: Array.from(
          new Set(
            students
              .filter((s: SearchStudent) => s.courseId === courseId)
              .map((s: SearchStudent) => s.section),
          ),
        ).map((sectionName: string) => ({
          sectionName,
          isAllowedtoViewStudentInSection: false,
          isAllowedToModifyStudent: false,
          students: students
            .filter((s: SearchStudent) => s.courseId === courseId && s.section === sectionName)
            .map((s: SearchStudent) =>
              ({
                name: s.name,
                email: s.email,
                status: s.joinState,
                team: s.team,
              }),
            ),
        })),
      }),
    );

    return coursesWithSections;
  }

  private getPrivileges(
    coursesWithSections: InstructorSearchResultCourse[],
  ): InstructorSearchResult {
    for (const course of coursesWithSections) {
      for (const section of course.sections) {
        this.httpRequestService
          .get(ResourceEndpoints.INSTRUCTOR_PRIVILEGE, {
            courseid: course.courseId,
            sectionname: section.sectionName,
          })
          .subscribe((res: InstructorPrivilege): void => {
            section.isAllowedtoViewStudentInSection =
              res.canViewStudentInSections;
            section.isAllowedToModifyStudent = res.canModifyStudent;
          });
      }
    }

    return {
      searchStudentsTables: coursesWithSections,
    };
  }
}

/**
 * The typings for the response object returned by the instructor search service.
 */
export interface InstructorSearchResult {
  searchStudentsTables: InstructorSearchResultCourse[];
}

/**
 * The typings for a course in the instructor search result.
 */
export interface InstructorSearchResultCourse {
  courseId: string;
  sections: InstructorSearchResultSection[];
}

interface InstructorSearchResultSection {
  sectionName: string;
  isAllowedtoViewStudentInSection: boolean;
  isAllowedToModifyStudent: boolean;
  students: InstructorSearchResultStudent[];
}

interface InstructorSearchResultStudent {
  name: string;
  email: string;
  status: JoinState;
  team: string;
}
