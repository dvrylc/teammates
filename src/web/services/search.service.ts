import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Instructor,
  Instructors,
  SearchCourses,
  SearchCoursesCommon,
  SearchLinks,
  SearchLinksInstructor,
  SearchLinksStudent,
  SearchSessions,
  Student,
  Students,
  StudentSessions,
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
    ).pipe(map((res: [Instructors, Students, SearchSessions, SearchLinks, SearchCourses]) => this.joinAdmin(res)));
  }

  private getStudents(searchKey: string): Observable<Students> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/students', paramMap);
  }

  private getInstructors(searchKey: string): Observable<Instructors> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/instructors', paramMap);
  }

  private getSessions(searchKey: string): Observable<SearchSessions> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/sessions', paramMap);
  }

  private getLinks(searchKey: string): Observable<SearchLinks> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/links', paramMap);
  }

  private getCourses(searchKey: string): Observable<SearchCourses> {
    const paramMap: { [key: string]: string } = {
      searchkey: searchKey,
    };
    return this.httpRequestService.get('/search/courses', paramMap);
  }

  private joinAdmin(resp: [Instructors, Students, SearchSessions, SearchLinks, SearchCourses]): AdminSearchResult {
    const [instructors, students, sessions, links, courses]:
      [Instructors, Students, SearchSessions, SearchLinks, SearchCourses] = resp;
    return {
      students: this.joinAdminStudents([students, sessions, links, courses]),
      instructors: this.joinAdminInstructors([instructors, links, courses]),
    };
  }

  private joinAdminStudents(
    resp: [Students, SearchSessions, SearchLinks, SearchCourses],
  ): StudentAccountSearchResult[] {
    const [students, sessions, links, courses]
      : [Students, SearchSessions, SearchLinks, SearchCourses] = resp;
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
      };
      const { email, name, comments, teamName: team, sectionName: section, googleId = '' }: Student = student;
      studentResult = { ...studentResult, email, name, comments, team, section, googleId };

      // Join sessions
      const matchingSessions: StudentSessions = sessions.sessions[email];
      if (matchingSessions != null) {
        const { openSessions, closedSessions, publishedSessions }: StudentSessions = matchingSessions;
        studentResult = { ...studentResult, openSessions, closedSessions, publishedSessions };
      }

      // Join courses
      const matchingCourses: SearchCoursesCommon[] =
        courses.students.filter((el: SearchCoursesCommon) => el.email === email);
      if (matchingCourses.length !== 0) {
        const { courseId, courseName, institute }: SearchCoursesCommon = matchingCourses[0];
        studentResult = { ...studentResult, courseId, courseName, institute };
      }

      // Join links
      const matchingLinks: SearchLinksStudent[] = links.students.filter((el: SearchLinksStudent) => el.email === email);
      if (matchingLinks.length !== 0) {
        const { courseJoinLink, manageAccountLink, recordsPageLink, homePageLink }: SearchLinksStudent
          = matchingLinks[0];
        studentResult = { ...studentResult, courseJoinLink, manageAccountLink, recordsPageLink, homePageLink };
      }

      studentsData.push(studentResult);
    }

    return studentsData;
  }

  private joinAdminInstructors(resp: [Instructors, SearchLinks, SearchCourses ]): InstructorAccountSearchResult[] {
    const [instructors, links, courses]: [Instructors, SearchLinks, SearchCourses] = resp;
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
      };
      const { email, name, googleId }: Instructor = instructor;
      instructorResult = { ...instructorResult, email, name, googleId };

      // Join courses
      const matchingCourses: SearchCoursesCommon[]
        = courses.instructors.filter((el: SearchCoursesCommon) => el.email === email);
      if (matchingCourses.length !== 0) {
        const { courseId, courseName, institute }: SearchCoursesCommon = matchingCourses[0];
        instructorResult = { ...instructorResult, courseId, courseName, institute };
      }

      // Join links
      const matchingLinks: SearchLinksInstructor[]
        = links.instructors.filter((el: SearchLinksInstructor) => el.email === email);
      if (matchingLinks.length !== 0) {
        const { courseJoinLink, manageAccountLink, homePageLink }: SearchLinksInstructor = matchingLinks[0];
        instructorResult = { ...instructorResult, courseJoinLink, manageAccountLink, homePageLink };
      }

      instructorsData.push(instructorResult);
    }

    return instructorsData;
  }
}

/**
 * Search results for the Admin endpoint.
 */
export interface AdminSearchResult {
  students: StudentAccountSearchResult[];
  instructors: InstructorAccountSearchResult[];
}

interface InstructorAccountSearchResult {
  name: string;
  email: string;
  googleId: string;
  courseId: string;
  courseName: string;
  institute: string;
  courseJoinLink: string;
  homePageLink: string;
  manageAccountLink: string;
  showLinks: boolean;
}

/**
 * Search results for students from the Admin endpoint.
 */
export interface StudentAccountSearchResult extends InstructorAccountSearchResult {
  section: string;
  team: string;
  comments: string;
  recordsPageLink: string;
  openSessions: { [index: string]: string };
  closedSessions: { [index: string]: string };
  publishedSessions: { [index: string]: string };
}
