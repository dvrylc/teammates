import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Instructors, SearchSessions, Students, StudentSessions } from '../types/api-output';
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
    ).pipe(map(this.joinAdmin));
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

  private joinAdmin(resp: [Instructors, Students, SearchSessions, SearchLinks, SearchCourses ]): AdminSearchResult {
    const [instructors, students, sessions, links, courses]
      : Array<Instructors | Students | SearchSessions | SearchLinks | SearchCourses> = resp;
    return {
      students: this.joinAdminStudents([students, sessions, links, courses]),
      instructors: this.joinAdminInstructors([instructors, links, courses]),
    };
  }

  /**
   * JoinAdmin defaults to using the email as the join key.
   */
  private joinAdminStudents(
    resp: [Students, SearchSessions, SearchLinks, SearchCourses ]
  ): StudentAccountSearchResult[] {
    const [students, sessions, links, courses]
      : Array<Students | SearchSessions | SearchLinks | SearchCourses>= resp;
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
      const { email, name, comments, teamName: team, sectionName: section, googleId } = student;
      studentResult = { ...studentResult, email, name, comments, team, section, googleId };

      // Join sessions
      const matchingSessions: StudentSessions = sessions.sessions[email];
      if (matchingSessions != null) {
        const { openSessions, closedSessions, publishedSessions } = matchingSessions;
        studentResult = { ...studentResult, openSessions, closedSessions, publishedSessions };
      }

      // Join courses
      const matchingCourses = courses.students.filter(el => el.email === email);
      if (matchingCourses.length !== 0) {
        const { courseId, courseName, institute } = matchingCourses[0];
        studentResult = { ...studentResult, courseId, courseName, institute };
      }

      // Join links
      const matchingLinks = links.students.filter(el => el.email === email);
      if (matchingLinks.length !== 0) {
        const { courseJoinLink, manageAccountLink, recordsPageLink, homePageLink } = matchingLinks[0];
        studentResult = { ...studentResult, courseJoinLink, manageAccountLink, recordsPageLink, homePageLink };
      }

      studentsData.push(studentResult);
    }

    return studentsData;
  }

  private joinAdminInstructors(resp: [Instructors, SearchLinks, SearchCourses ]): InstructorAccountSearchResult[] {
    const [instructors, links, courses] = resp;
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
      const { email, name, googleId } = instructor;
      instructorResult = { ...instructorResult, email, name, googleId };

      // Join courses
      const matchingCourses = courses.instructors.filter(el => el.email === email);
      if (matchingCourses.length !== 0) {
        const { courseId, courseName, institute } = matchingCourses[0];
        instructorResult = { ...instructorResult, courseId, courseName, institute };
      }

      // Join links
      const matchingLinks = links.instructors.filter(el => el.email === email);
      if (matchingLinks.length !== 0) {
        const { courseJoinLink, manageAccountLink, homePageLink } = matchingLinks[0];
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

/**
 * Search results for students from the Admin endpoint.
 */
export interface StudentAccountSearchResult extends CommonAccountSearchResult {
  section: string;
  team: string;
  comments: string;
  recordsPageLink: string;
  openSessions: { [index: string]: string };
  closedSessions: { [index: string]: string };
  publishedSessions: { [index: string]: string };
}

/**
 * Search results for instructors from the Admin endpoint.
 */
export interface InstructorAccountSearchResult extends CommonAccountSearchResult {
}

interface CommonAccountSearchResult {
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

// TODO: Delete once the PRs are merged
interface SearchCourses {
  students: SearchCoursesCommon[];
  instructors: SearchCoursesCommon[];
}

interface SearchCoursesCommon {
  email: string;
  courseId: string;
  courseName: string;
  institute: string;
}

interface SearchLinksInstructor {
  showLinks: boolean;
  email: string;
  manageAccountLink: string;
  homePageLink: string;
  courseJoinLink: string;
}

interface SearchLinksStudent {
  showLinks: boolean;
  email: string;
  manageAccountLink: string;
  homePageLink: string;
  courseJoinLink: string;
  recordsPageLink: string;
}

interface SearchLinks {
  students: SearchLinksStudent[];
  instructors: SearchLinksInstructor[];
}
