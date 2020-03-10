import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  JoinState,
  SearchCourse,
  SearchCoursesResult,
  SearchInstructor,
  SearchInstructorsResult,
  SearchLinksInstructor,
  SearchLinksResult,
  SearchLinksStudent,
  SearchSession,
  SearchSessionsResult,
  SearchStudent,
  SearchStudentsResult,
} from '../types/api-output';
import { HttpRequestService } from './http-request.service';

/**
 * Handles the logic for search.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private httpRequestService: HttpRequestService) {
  }

  searchAdmin(searchKey: string): Observable<AdminSearchResult> {
    return forkJoin(
        this.getInstructors(searchKey),
        this.getStudents(searchKey),
        this.getSessions(searchKey),
        this.getLinks(searchKey),
        this.getCourses(searchKey),
    ).pipe(map((res: [
      SearchInstructorsResult,
      SearchStudentsResult,
      SearchSessionsResult,
      SearchLinksResult,
      SearchCoursesResult
    ]) => this.joinAdmin(res)));
  }

  private getStudents(searchKey: string): Observable<SearchStudentsResult> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/students', paramMap);
  }

  private getInstructors(searchKey: string): Observable<SearchInstructorsResult> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/instructors', paramMap);
  }

  private getSessions(searchKey: string): Observable<SearchSessionsResult> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/sessions', paramMap);
  }

  private getLinks(searchKey: string): Observable<SearchLinksResult> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/links', paramMap);
  }

  private getCourses(searchKey: string): Observable<SearchCoursesResult> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/courses', paramMap);
  }

  private joinAdmin(
    resp: [
      SearchInstructorsResult,
      SearchStudentsResult,
      SearchSessionsResult,
      SearchLinksResult,
      SearchCoursesResult
    ],
  ): AdminSearchResult {
    const [instructors, students, sessions, links, courses]:
      [
        SearchInstructorsResult,
        SearchStudentsResult,
        SearchSessionsResult,
        SearchLinksResult,
        SearchCoursesResult
      ] = resp;
    return {
      students: this.joinAdminStudents([students, sessions, links, courses]),
      instructors: this.joinAdminInstructors([instructors, links, courses]),
    };
  }

  private joinAdminStudents(
    resp: [
      SearchStudentsResult,
      SearchSessionsResult,
      SearchLinksResult,
      SearchCoursesResult
    ],
  ): StudentAccountSearchResult[] {
    const [students, sessions, links, courses]
      : [SearchStudentsResult, SearchSessionsResult, SearchLinksResult, SearchCoursesResult] = resp;
    const studentsData: StudentAccountSearchResult[] = [];
    for (const student of students.students) {
      let studentResult: StudentAccountSearchResult = {
        email: '',
        name: '',
        comments: '',
        team: '',
        section: '',
        openSessions: {},
        closedSessions: {},
        publishedSessions: {},
        courseId: '',
        courseName: '',
        institute: '',
        manageAccountLink: '',
        homePageLink: '',
        recordsPageLink: '',
        courseJoinLink: '',
        googleId: '',
        showLinks: false,
        joinState: JoinState.NOT_JOINED,
      };
      studentResult = { ...studentResult, ...student };

      // Join sessions
      const matchingSessions: SearchSession = sessions.sessions[student.email];
      if (matchingSessions != null) {
        studentResult = { ...studentResult, ...matchingSessions };
      }

      // Join courses
      const matchingCourses: SearchCourse[] =
        courses.students.filter((el: SearchCourse) => el.email === student.email);
      if (matchingCourses.length !== 0) {
        studentResult = { ...studentResult, ...matchingCourses[0] };
      }

      // Join links
      const matchingLinks: SearchLinksStudent[] = links.students
        .filter((el: SearchLinksStudent) => el.email === student.email);
      if (matchingLinks.length !== 0) {
        studentResult = { ...studentResult, ...matchingLinks[0] };
      }

      studentsData.push(studentResult);
    }

    return studentsData;
  }

  private joinAdminInstructors(
    resp: [
      SearchInstructorsResult,
      SearchLinksResult,
      SearchCoursesResult,
    ],
  ): InstructorAccountSearchResult[] {
    const [instructors, links, courses]:
      [SearchInstructorsResult, SearchLinksResult, SearchCoursesResult] = resp;
    const instructorsData: InstructorAccountSearchResult[] = [];
    for (const instructor of instructors.instructors) {
      let instructorResult: InstructorAccountSearchResult = {
        email: '',
        name: '',
        courseId: '',
        courseName: '',
        institute: '',
        manageAccountLink: '',
        homePageLink: '',
        courseJoinLink: '',
        googleId: '',
        showLinks: false,
        joinState: JoinState.NOT_JOINED,
      };
      instructorResult = { ...instructorResult, ...instructor };

      // Join courses
      const matchingCourses: SearchCourse[]
        = courses.instructors.filter((el: SearchCourse) => el.email === instructor.email);
      if (matchingCourses.length !== 0) {
        instructorResult = { ...instructorResult, ...matchingCourses[0] };
      }

      // Join links
      const matchingLinks: SearchLinksInstructor[]
        = links.instructors.filter((el: SearchLinksInstructor) => el.email === instructor.email);
      if (matchingLinks.length !== 0) {
        instructorResult = { ...instructorResult, ...matchingLinks[0] };
      }

      instructorsData.push(instructorResult);
    }

    return instructorsData;
  }
}

/**
 * The typings of the response objects returned by the search service.
 */
export interface AdminSearchResult {
  students: StudentAccountSearchResult[];
  instructors: InstructorAccountSearchResult[];
}

/**
 * The typings for the instructor account search result.
 */
export type InstructorAccountSearchResult =
  SearchInstructor & SearchLinksInstructor & SearchCourse;

/**
 * The typings for the student account search result.
 */
export type StudentAccountSearchResult =
  SearchStudent & SearchLinksStudent & SearchCourse & SearchSession;
