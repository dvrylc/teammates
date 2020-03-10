import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoadingBarService } from '../../../services/loading-bar.service';
import { StatusMessageService } from '../../../services/status-message.service';
import { ErrorMessageOutput } from '../../error-message-output';
import { StudentListSectionData } from '../student-list/student-list-section-data';
import { InstructorSearchResult, InstructorSearchResultCourse, SearchService } from '../../../services/search.service';

/**
 * Data object for communciation with the child student result component
 */
export interface SearchStudentsTable {
  courseId: string;
  sections: StudentListSectionData[];
}

/**
 * Data object for communciation with the child search bar component
 */
export interface SearchQuery {
  searchKey: string;
  searchStudents: boolean;
  searchFeedbackSessionData: boolean;
}

/**
 * Instructor search page.
 */
@Component({
  selector: 'tm-instructor-search-page',
  templateUrl: './instructor-search-page.component.html',
  styleUrls: ['./instructor-search-page.component.scss'],
})
export class InstructorSearchPageComponent implements OnInit {

  searchKey: string = '';
  studentTables: InstructorSearchResultCourse[] = [];

  constructor(private route: ActivatedRoute,
              private statusMessageService: StatusMessageService,
              private loadingBarService: LoadingBarService,
              private searchService: SearchService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: any) => {
      if (queryParams.studentSearchkey) {
        this.searchKey = queryParams.studentSearchkey;
      }
      if (this.searchKey) {
        this.search({
          searchKey: this.searchKey,
          searchStudents: true,
          searchFeedbackSessionData: false,
        });
      }
    });
  }

  /**
   * Searches for students and questions/responses/comments matching the search query.
   */
  search(searchQuery: SearchQuery): void {
    this.loadingBarService.showLoadingBar();
    const paramMap: { [key: string]: string } = {
      searchkey: searchQuery.searchKey,
    };

    this.searchService.searchInstructor(paramMap.searchkey)
    .pipe(finalize(() => this.loadingBarService.hideLoadingBar()))
    .subscribe((resp: InstructorSearchResult) => {
      this.studentTables = resp.searchStudentsTables;
      const hasStudents: boolean = !!(this.studentTables && this.studentTables.length);
      if (!hasStudents) {
        this.statusMessageService.showWarningMessage('No results found.');
      }
    }, (resp: ErrorMessageOutput) => {
      this.statusMessageService.showErrorMessage(resp.error.message);
    });
  }

}
