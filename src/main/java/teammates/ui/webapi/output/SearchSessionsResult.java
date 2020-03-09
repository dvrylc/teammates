package teammates.ui.webapi.output;

import java.util.Map;

/**
 * Output format for session search result.
 */
public class SearchSessionsResult extends ApiOutput {
    private final Map<String, SearchSessionData> sessions;

    public SearchSessionsResult(Map<String, SearchSessionData> sessions) {
        this.sessions = sessions;
    }

    public Map<String, SearchSessionData> getSessions() {
        return sessions;
    }
}
