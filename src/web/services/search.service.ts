import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { ResourceEndpoints } from '../types/api-endpoints';
import {
  JoinState,
  SearchStudentsResult,
  SearchStudent,
} from '../types/api-output';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      (c: string) => ({
        courseId: c,
        sections: Array.from(
          new Set(
            students
              .filter((s: SearchStudent) => s.courseId === c)
              .map((s: SearchStudent) => s.section),
          ),
        ).map((s: string) => ({
          sectionName: s,
          isAllowedtoViewStudentInSection: false,
          isAllowedToModifyStudent: false,
          students: students
            .filter((s: SearchStudent) => s.courseId === c)
            .map((s: SearchStudent) =>
              (({
                name,
                email,
                joinState: status,
                team,
              }): {
                name: string;
                email: string;
                status: JoinState;
                team: string;
              } => ({
                name,
                email,
                status,
                team,
              }))(s),
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
          .subscribe(res => {
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

export interface InstructorSearchResult {
  searchStudentsTables: InstructorSearchResultCourse[];
}

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
