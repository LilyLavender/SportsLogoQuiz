class SportsTeam {
    constructor(names, city, abbreviation, league, hasSportInLogo, hasAbInLogo) {
        this.names = names;
        this.city = city;
        this.abbreviation = abbreviation;
        this.league = league;
        this.hasSportInLogo = hasSportInLogo;
        this.hasAbInLogo = hasAbInLogo;
    }

    generateFileName() {
        return this.league.toLowerCase() + "-" + this.abbreviation.toLowerCase() + ".png";
    }

    get getNames() { return this.names; }
    get getCity() { return this.city; }
    get getAbbreviation() { return this.abbreviation; }
    get getLeauge() { return this.league; }
    get getSportInLogo() { return this.hasSportInLogo; }
    get getAbInLogo() { return this.hasAbInLogo; }
}

let totalScore = 0;
let totalScoreNoStreak = 0;
let tempScore = 100;
let scoreInterval;
let lockBox = false;
let paused = false;
let quizStartTime = 0;
let totalPausedTime = 0;
let pauseStartTime = null;
let leagueStats = {};
const _savedLeagues = JSON.parse(localStorage.getItem('selectedLeagues') || 'null');
let selectedLeagues = new Set(_savedLeagues && _savedLeagues.length ? _savedLeagues : ['MLB', 'NBA', 'NFL', 'NHL']);
const leagueCounts = { MLB: 30, NBA: 30, NFL: 32, NHL: 32 };

$(document).ready(function() {
    $('#endScreen').hide();
    const teamsBeta = new Map();

    // Declare teams
    teamsBeta.set("MLB-ATL", new SportsTeam(['Braves'], 'Atlanta', 'ATL', 'MLB', false, false));
    teamsBeta.set("MLB-AZ", new SportsTeam(['Diamondbacks', 'Dbacks'], 'Arizona', 'AZ', 'MLB', false, false));
    teamsBeta.set("MLB-BAL", new SportsTeam(['Orioles', 'O\'s', 'Os'], 'Baltimore', 'BAL', 'MLB', true, false));
    teamsBeta.set("MLB-BOS", new SportsTeam(['Red Sox'], 'Boston', 'BOS', 'MLB', false, false));
    teamsBeta.set("MLB-CHC", new SportsTeam(['Cubs'], 'Chicago', 'CHC', 'MLB', false, false));
    teamsBeta.set("MLB-CIN", new SportsTeam(['Reds'], 'Cincinnati', 'CIN', 'MLB', false, false));
    teamsBeta.set("MLB-CLE", new SportsTeam(['Guardians'], 'Cleveland', 'CLE', 'MLB', true, false));
    teamsBeta.set("MLB-COL", new SportsTeam(['Rockies'], 'Colorado', 'COL', 'MLB', false, false));
    teamsBeta.set("MLB-CWS", new SportsTeam(['White Sox'], 'Chicago', 'CWS', 'MLB', false, false));
    teamsBeta.set("MLB-DET", new SportsTeam(['Tigers'], 'Detroit', 'DET', 'MLB', false, false));
    teamsBeta.set("MLB-HOU", new SportsTeam(['Astros'], 'Houston', 'HOU', 'MLB', false, false));
    teamsBeta.set("MLB-KC", new SportsTeam(['Royals'], 'Kansas City', 'KC', 'MLB', false, true));
    teamsBeta.set("MLB-LAA", new SportsTeam(['Angels'], 'Los Angeles', 'LAA', 'MLB', false, false));
    teamsBeta.set("MLB-LAD", new SportsTeam(['Dodgers'], 'Los Angeles', 'LAD', 'MLB', false, false));
    teamsBeta.set("MLB-MIA", new SportsTeam(['Marlins'], 'Miami', 'MIA', 'MLB', false, false));
    teamsBeta.set("MLB-MIL", new SportsTeam(['Brewers'], 'Milwaukee', 'MIL', 'MLB', true, false));
    teamsBeta.set("MLB-MIN", new SportsTeam(['Twins'], 'Minnesota', 'MIN', 'MLB', false, false));
    teamsBeta.set("MLB-NYM", new SportsTeam(['Mets'], 'New York', 'NYM', 'MLB', true, false));
    teamsBeta.set("MLB-NYY", new SportsTeam(['Yankees'], 'New York', 'NYY', 'MLB', true, false));
    teamsBeta.set("MLB-PHI", new SportsTeam(['Phillies'], 'Philadelphia', 'PHI', 'MLB', false, false));
    teamsBeta.set("MLB-PIT", new SportsTeam(['Pirates'], 'Pittsburgh', 'PIT', 'MLB', false, false));
    teamsBeta.set("MLB-SD", new SportsTeam(['Padres'], 'San Diego', 'SD', 'MLB', false, true));
    teamsBeta.set("MLB-SEA", new SportsTeam(['Mariners'], 'Seattle', 'SEA', 'MLB', true, false));
    teamsBeta.set("MLB-SF", new SportsTeam(['Giants'], 'San Fransisco', 'SF', 'MLB', false, true));
    teamsBeta.set("MLB-STL", new SportsTeam(['Cardinals'], 'St. Louis', 'STL', 'MLB', true, false));
    teamsBeta.set("MLB-TB", new SportsTeam(['Rays'], 'Tampa Bay', 'TB', 'MLB', false, true));
    teamsBeta.set("MLB-TEX", new SportsTeam(['Rangers'], 'Texas', 'TEX', 'MLB', false, false));
    teamsBeta.set("MLB-TOR", new SportsTeam(['Blue Jays'], 'Toronto', 'TOR', 'MLB', false, false));
    teamsBeta.set("MLB-ATH", new SportsTeam(['Athletics', 'A\'s', 'As'], '', 'ATH', 'MLB', false, false));
    teamsBeta.set("MLB-WSH", new SportsTeam(['Nationals', 'Nats'], 'Washington', 'WSH', 'MLB', false, false));

    teamsBeta.set("NBA-ATL", new SportsTeam(['Hawks'], 'Atlanta', 'ATL', 'NBA', false, false));
    teamsBeta.set("NBA-BKN", new SportsTeam(['Nets'], 'Brooklyn', 'BKN', 'NBA', true, false));
    teamsBeta.set("NBA-BOS", new SportsTeam(['Celtics'], 'Boston', 'BOS', 'NBA', true, false));
    teamsBeta.set("NBA-CHA", new SportsTeam(['Hornets'], 'Charlotte', 'CHA', 'NBA', true, false));
    teamsBeta.set("NBA-CHI", new SportsTeam(['Bulls'], 'Chicago', 'CHI', 'NBA', false, false));
    teamsBeta.set("NBA-CLE", new SportsTeam(['Cavaliers', 'Cavs'], 'Cleveland', 'CLE', 'NBA', false, false));
    teamsBeta.set("NBA-DAL", new SportsTeam(['Mavericks', 'Mavs'], 'Dallas', 'DAL', 'NBA', true, false));
    teamsBeta.set("NBA-DEN", new SportsTeam(['Nuggets'], 'Denver', 'DEN', 'NBA', true, false));
    teamsBeta.set("NBA-DET", new SportsTeam(['Pistons'], 'Detroit', 'DET', 'NBA', true, false));
    teamsBeta.set("NBA-GSW", new SportsTeam(['Warriors'], 'Golden State', 'GSW', 'NBA', false, false));
    teamsBeta.set("NBA-HOU", new SportsTeam(['Rockets'], 'Houston', 'HOU', 'NBA', false, false));
    teamsBeta.set("NBA-IND", new SportsTeam(['Pacers'], 'Indiana', 'IND', 'NBA', true, false));
    teamsBeta.set("NBA-LAC", new SportsTeam(['Clippers'], 'Los Angeles', 'LAC', 'NBA', true, false));
    teamsBeta.set("NBA-LAL", new SportsTeam(['Lakers'], 'Los Angeles', 'LAL', 'NBA', true, false));
    teamsBeta.set("NBA-MEM", new SportsTeam(['Grizzlies'], 'Memphis', 'MEM', 'NBA', false, false));
    teamsBeta.set("NBA-MIA", new SportsTeam(['Heat'], 'Miami', 'MIA', 'NBA', true, false));
    teamsBeta.set("NBA-MIL", new SportsTeam(['Bucks'], 'Milwaukee', 'MIL', 'NBA', false, false));
    teamsBeta.set("NBA-MIN", new SportsTeam(['Timberwolves', 'Wolves'], 'Minnesota', 'MIN', 'NBA', true, false));
    teamsBeta.set("NBA-NOP", new SportsTeam(['Pelicans'], 'New Orleans', 'NOP', 'NBA', true, false));
    teamsBeta.set("NBA-NYK", new SportsTeam(['Knicks', 'Knickerbockers'], 'New York', 'NYK', 'NBA', true, false));
    teamsBeta.set("NBA-OKC", new SportsTeam(['Thunder'], 'Oklahoma City', 'OKC', 'NBA', true, true));
    teamsBeta.set("NBA-ORL", new SportsTeam(['Magic'], 'Orlando', 'ORL', 'NBA', true, false));
    teamsBeta.set("NBA-PHI", new SportsTeam(['76ers', 'Sixers'], 'Philadelphia', 'PHI', 'NBA', false, false));
    teamsBeta.set("NBA-PHX", new SportsTeam(['Suns'], 'Phoenix', 'PHX', 'NBA', true, false));
    teamsBeta.set("NBA-POR", new SportsTeam(['Trail Blazers', 'Blazers'], 'Portland', 'POR', 'NBA', false, false));
    teamsBeta.set("NBA-SAC", new SportsTeam(['Kings'], 'Sacramento', 'SAC', 'NBA', true, true));
    teamsBeta.set("NBA-SAS", new SportsTeam(['Spurs'], 'San Antonio', 'SAS', 'NBA', false, false));
    teamsBeta.set("NBA-TOR", new SportsTeam(['Raptors'], 'Toronto', 'TOR', 'NBA', true, false));
    teamsBeta.set("NBA-UTA", new SportsTeam(['Jazz'], 'Utah', 'UTA', 'NBA', true, false));
    teamsBeta.set("NBA-WAS", new SportsTeam(['Wizards'], 'Washington', 'WAS', 'NBA', true, false));

    teamsBeta.set("NFL-ARZ", new SportsTeam(['Cardinals'], 'Arizona', 'ARZ', 'NFL', false, false));
    teamsBeta.set("NFL-ATL", new SportsTeam(['Falcons'], 'Atlanta', 'ATL', 'NFL', false, false));
    teamsBeta.set("NFL-BAL", new SportsTeam(['Ravens'], 'Baltimore', 'BAL', 'NFL', false, false));
    teamsBeta.set("NFL-BUF", new SportsTeam(['Bills'], 'Buffalo', 'BUF', 'NFL', false, false));
    teamsBeta.set("NFL-CAR", new SportsTeam(['Panthers'], 'Carolina', 'CAR', 'NFL', false, false));
    teamsBeta.set("NFL-CHI", new SportsTeam(['Bears'], 'Chicago', 'CHI', 'NFL', false, false));
    teamsBeta.set("NFL-CIN", new SportsTeam(['Bengals'], 'Cincinnati', 'CIN', 'NFL', false, false));
    teamsBeta.set("NFL-CLV", new SportsTeam(['Browns'], 'Cleveland', 'CLV', 'NFL', true, false));
    teamsBeta.set("NFL-DAL", new SportsTeam(['Cowboys'], 'Dallas', 'DAL', 'NFL', false, false));
    teamsBeta.set("NFL-DEN", new SportsTeam(['Broncos'], 'Denver', 'DEN', 'NFL', false, false));
    teamsBeta.set("NFL-DET", new SportsTeam(['Lions'], 'Detroit', 'DET', 'NFL', false, false));
    teamsBeta.set("NFL-GB", new SportsTeam(['Packers'], 'Green Bay', 'GB', 'NFL', false, false));
    teamsBeta.set("NFL-HST", new SportsTeam(['Texans'], 'Houston', 'HST', 'NFL', false, false));
    teamsBeta.set("NFL-IND", new SportsTeam(['Colts'], 'Indianapolis', 'IND', 'NFL', false, false));
    teamsBeta.set("NFL-JAX", new SportsTeam(['Jaguars', 'Jags'], 'Jackonville', 'JAX', 'NFL', false, false));
    teamsBeta.set("NFL-KC", new SportsTeam(['Chiefs'], 'Kansas City', 'KC', 'NFL', false, true));
    teamsBeta.set("NFL-LA", new SportsTeam(['Rams'], 'Los Angeles', 'LA', 'NFL', false, true));
    teamsBeta.set("NFL-LAC", new SportsTeam(['Chargers'], 'Los Angeles', 'LAC', 'NFL', false, false));
    teamsBeta.set("NFL-LV", new SportsTeam(['Raiders'], 'Las Vegas', 'LV', 'NFL', true, false));
    teamsBeta.set("NFL-MIA", new SportsTeam(['Dolphins'], 'Miami', 'MIA', 'NFL', false, false));
    teamsBeta.set("NFL-MIN", new SportsTeam(['Vikings'], 'Minnesota', 'MIN', 'NFL', false, false));
    teamsBeta.set("NFL-NE", new SportsTeam(['Patriots'], 'New England', 'NE', 'NFL', false, false));
    teamsBeta.set("NFL-NO", new SportsTeam(['Saints'], 'New Orleans', 'NO', 'NFL', false, false));
    teamsBeta.set("NFL-NYG", new SportsTeam(['Giants'], 'New York', 'NYG', 'NFL', false, false));
    teamsBeta.set("NFL-NYJ", new SportsTeam(['Jets'], 'New York', 'NYJ', 'NFL', true, false));
    teamsBeta.set("NFL-PHI", new SportsTeam(['Eagles'], 'Philadelphia', 'PHI', 'NFL', false, false));
    teamsBeta.set("NFL-PIT", new SportsTeam(['Steelers'], 'Pittsburgh', 'PIT', 'NFL', false, false));
    teamsBeta.set("NFL-SEA", new SportsTeam(['Seahawks'], 'Seattle', 'SEA', 'NFL', false, false));
    teamsBeta.set("NFL-SF", new SportsTeam(['49ers', 'Niners'], 'San Fransisco', 'SF', 'NFL', false, true));
    teamsBeta.set("NFL-TB", new SportsTeam(['Buccaneers', 'Bucs'], 'Tampa Bay', 'TB', 'NFL', true, false));
    teamsBeta.set("NFL-TEN", new SportsTeam(['Titans'], 'Tennessee', 'TEN', 'NFL', false, false));
    teamsBeta.set("NFL-WAS", new SportsTeam(['Commanders'], 'Washington', 'WAS', 'NFL', false, false));

    teamsBeta.set("NHL-ANA", new SportsTeam(['Ducks'], 'Anaheim', 'ANA', 'NHL', true, false));
    teamsBeta.set("NHL-BOS", new SportsTeam(['Bruins'], 'Boston', 'BOS', 'NHL', false, false));
    teamsBeta.set("NHL-BUF", new SportsTeam(['Sabres'], 'Buffalo', 'BUF', 'NHL', false, false));
    teamsBeta.set("NHL-CAR", new SportsTeam(['Hurricanes', 'Canes'], 'Carolina', 'CAR', 'NHL', false, false));
    teamsBeta.set("NHL-CBJ", new SportsTeam(['Blue Jackets', 'Jackets'], 'Columbus', 'CBJ', 'NHL', false, false));
    teamsBeta.set("NHL-CGY", new SportsTeam(['Flames'], 'Calgary', 'CGY', 'NHL', false, false));
    teamsBeta.set("NHL-CHI", new SportsTeam(['Blackhawks', 'Hawks'], 'Chicago', 'CHI', 'NHL', false, false));
    teamsBeta.set("NHL-COL", new SportsTeam(['Avalanche', 'Avs'], 'Colorado', 'COL', 'NHL', true, false));
    teamsBeta.set("NHL-DAL", new SportsTeam(['Stars'], 'Dallas', 'DAL', 'NHL', false, false));
    teamsBeta.set("NHL-DET", new SportsTeam(['Red Wings', 'Wings'], 'Detroit', 'DET', 'NHL', false, false));
    teamsBeta.set("NHL-EDM", new SportsTeam(['Oilers'], 'Edmonton', 'EDM', 'NHL', false, false));
    teamsBeta.set("NHL-FLA", new SportsTeam(['Panthers'], 'Florida', 'FLA', 'NHL', false, false));
    teamsBeta.set("NHL-LAK", new SportsTeam(['Kings'], 'Los Angeles', 'LAK', 'NHL', false, false));
    teamsBeta.set("NHL-MIN", new SportsTeam(['Wild'], 'Minnesota', 'MIN', 'NHL', false, false));
    teamsBeta.set("NHL-MTL", new SportsTeam(['Canadiens', 'Habs'], 'Montreal', 'MTL', 'NHL', false, false));
    teamsBeta.set("NHL-NJD", new SportsTeam(['Devils'], 'New Jersey', 'NJD', 'NHL', false, false));
    teamsBeta.set("NHL-NSH", new SportsTeam(['Predators', 'Preds'], 'Nashville', 'NSH', 'NHL', false, false));
    teamsBeta.set("NHL-NYI", new SportsTeam(['Islanders', 'Isles'], 'New York', 'NYI', 'NHL', true, false));
    teamsBeta.set("NHL-NYR", new SportsTeam(['Rangers'], 'New York', 'NYR', 'NHL', false, false));
    teamsBeta.set("NHL-OTT", new SportsTeam(['Senators', 'Sens'], 'Ottawa', 'OTT', 'NHL', false, false));
    teamsBeta.set("NHL-PHI", new SportsTeam(['Flyers'], 'Philadelphia', 'PHI', 'NHL', false, false));
    teamsBeta.set("NHL-PIT", new SportsTeam(['Penguins', 'Pens'], 'Pittsburgh', 'PIT', 'NHL', true, false));
    teamsBeta.set("NHL-SEA", new SportsTeam(['Kraken'], 'Seattle', 'SEA', 'NHL', false, false));
    teamsBeta.set("NHL-SJS", new SportsTeam(['Sharks'], 'San Jose', 'SJS', 'NHL', true, false));
    teamsBeta.set("NHL-STL", new SportsTeam(['Blues'], 'St. Louis', 'STL', 'NHL', false, false));
    teamsBeta.set("NHL-TBL", new SportsTeam(['Lightning', 'Bolts'], 'Tampa Bay', 'TBL', 'NHL', false, false));
    teamsBeta.set("NHL-TOR", new SportsTeam(['Maple Leafs', 'Leafs'], 'Toronto', 'TOR', 'NHL', false, false));
    teamsBeta.set("NHL-UTA", new SportsTeam(['Mammoth'], 'Utah', 'UTA', 'NHL', false, false));
    teamsBeta.set("NHL-VAN", new SportsTeam(['Canucks'], 'Vancouver', 'VAN', 'NHL', false, false));
    teamsBeta.set("NHL-VGK", new SportsTeam(['Golden Knights'], 'Vegas', 'VGK', 'NHL', false, false));
    teamsBeta.set("NHL-WPG", new SportsTeam(['Jets'], 'Winnipeg', 'WPG', 'NHL', false, false));
    teamsBeta.set("NHL-WSH", new SportsTeam(['Capitals', 'Caps'], 'Washington', 'WSH', 'NHL', false, false));
    
    // Important vars (iterator is initialized when quiz starts)
    let teamIterator;
    let currentTeamEntry;
    let count = 1;
    let streak = 0;

    // Debug mode: set localStorage key 'debug' to 'true' to enable
    const debugMode = localStorage.getItem('debug') === 'true';
    if (debugMode) {
        $('<button>', { id: 'skip', text: 'Skip' }).appendTo('.left');
    }

    // Pause timer when tab is hidden; track cumulative pause duration
    document.addEventListener('visibilitychange', function() {
        paused = document.hidden;
        if (document.hidden) {
            pauseStartTime = Date.now();
        } else if (pauseStartTime !== null) {
            totalPausedTime += Date.now() - pauseStartTime;
            pauseStartTime = null;
        }
    });

    // Team count and high score on start screen
    updateTeamCountDisplay();

    // Sync button states with saved league preferences
    $('.leagueToggle').each(function() {
        if (!selectedLeagues.has($(this).data('league'))) $(this).removeClass('active');
    });

    // League toggle buttons
    $('.leagueToggle').on('click', function() {
        const lg = $(this).data('league');
        if (selectedLeagues.has(lg)) {
            if (selectedLeagues.size > 1) {
                selectedLeagues.delete(lg);
                $(this).removeClass('active');
            }
        } else {
            selectedLeagues.add(lg);
            $(this).addClass('active');
        }
        localStorage.setItem('selectedLeagues', JSON.stringify([...selectedLeagues]));
        updateTeamCountDisplay();
        buildScrollers();
    });

    // Restart / play again
    $('#restartBtn').on('click', () => location.reload());
    $('#playAgainBtn').on('click', () => location.reload());

    // Build background scrollers from teams in selected leagues
    function buildScrollers() {
        const filtered = Array.from(teamsBeta.values())
            .filter(t => selectedLeagues.has(t.getLeauge));

        // Shuffle
        const shuffled = [...filtered];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Distribute into 3 rows round-robin
        const rows = [[], [], []];
        shuffled.forEach((team, i) => rows[i % 3].push(team));

        ['#row1', '#row2', '#row3'].forEach((sel, ri) => {
            let rowTeams = [...rows[ri]];
            // Pad so one copy is wide enough to fill any viewport (min 40 logos)
            while (rowTeams.length < 40) rowTeams = [...rowTeams, ...rows[ri]];
            // Duplicate for seamless loop
            const loopTeams = [...rowTeams, ...rowTeams];
            const html = loopTeams.map(team => {
                const delay = (Math.random() * 3).toFixed(2);
                const dur = (2.0 + Math.random() * 1.2).toFixed(2);
                return `<img src="img/${team.generateFileName()}" alt="" style="animation-delay:${delay}s;animation-duration:${dur}s">`;
            }).join('');
            $(`${sel} .scrollTrack`).html(html);
        });
    }

    buildScrollers();

    // Start quiz
    $('#startQuizButton').on('click', function() {
        // Filter and shuffle teams by selected leagues
        const filteredEntries = [];
        for (const [key, team] of teamsBeta) {
            if (selectedLeagues.has(team.getLeauge)) filteredEntries.push([key, team]);
        }
        for (let i = filteredEntries.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredEntries[i], filteredEntries[j]] = [filteredEntries[j], filteredEntries[i]];
        }
        const filteredTeams = new Map(filteredEntries);

        // Update quiz counter
        $('#teamCountQuiz').text(` / ${filteredTeams.size}`);

        // Initialize per-league stats
        leagueStats = {};
        for (const lg of selectedLeagues) {
            leagueStats[lg] = { correct: 0, missed: 0, totalScore: 0, count: leagueCounts[lg] };
        }

        // Initialize iterator
        teamIterator = filteredTeams.entries();
        currentTeamEntry = teamIterator.next();
        count = 1;
        streak = 0;

        $('#startScreen').hide();
        $('#teamNameInput').focus();
        // Reset pause tracking so pre-quiz tab-switches don't skew avg time
        totalPausedTime = 0;
        pauseStartTime = null;
        quizStartTime = Date.now();
        createQuestion(currentTeamEntry.value[1], count);
    });

    // Handle next team (shocker)
    function handleNextTeam() {
        // Clear the input field
        $('#teamNameInput').val('').focus();

        // Move to the next team
        currentTeamEntry = teamIterator.next();
        if (!currentTeamEntry.done) {
            count++;
            createQuestion(currentTeamEntry.value[1], count);
        } else {
            // Average time per question (wall clock minus paused time)
            const totalElapsed = (Date.now() - quizStartTime - totalPausedTime) / 1000;
            const avgTime = totalElapsed / count;

            const key = getLeaderboardKey();
            const prevScores = getHighScores(key);
            const isNewHigh = prevScores.length === 0 || totalScore > prevScores[0].score;

            // Auto-save score then populate end screen
            const scores = saveHighScore('Anonymous', totalScore, key);
            const editIndex = scores.findIndex(e => e.name === 'Anonymous' && e.score === totalScore);
            $('#endFinalScore').text(totalScore);
            $('#endAverage').text(avgTime.toFixed(2) + 's');
            if (isNewHigh) $('#newHighScoreMsg').text('New High Score!');
            renderLeagueBreakdown();
            renderLeaderboard(scores, editIndex >= 0 ? editIndex : null, key);
            $('#leaderboard').show();
            $('#endScreen').show();
        }
    }

    // Update streak display
    function updateStreakDisplay() {
        let flames = '';
        if (streak >= 100) flames = ' 🔥🔥🔥';
        else if (streak >= 25) flames = ' 🔥🔥';
        else if (streak >= 10) flames = ' 🔥';
        $('#streakDisplay').text(streak + flames);
        if (streak >= 5) {
            $('#streakDisplay').addClass('hot');
        } else {
            $('#streakDisplay').removeClass('hot');
        }
    }

    // Make question
    function createQuestion(team, qNum) {
        tempScore = 100;
        $('#teamNameInput').removeClass('flash-correct flash-wrong');
        updateLongScoreDisplay(tempScore);
        clearInterval(scoreInterval);
        // Remove 1 from score every second
        scoreInterval = setInterval(function() {
            if (!lockBox && !paused) {
                tempScore -= 1;
                if (tempScore < 0) {
                    lockBox = true;
                    $('#teamNameInput').addClass('flash-wrong');
                    $('#leagueDisplay').text(team.getLeauge);
                    $('#abbreviationDisplay').text(team.getAbbreviation);
                    $('#cityDisplay').text(team.getCity);
                    $('#nameDisplay').text(team.getNames);

                    setTimeout(function() {
                        lockBox = false;
                        streak = 0;
                        updateStreakDisplay();
                        addToAnswerHistory(5, team.getLeauge, 0);
                        handleNextTeam();
                    }, 2500);
                }
                updateLongScoreDisplay(tempScore);
            }
        }, 1000);
        
        var fileName = team.generateFileName();

        // Set question number
        $('#qNum').text(qNum);

        // Create image
        var img = $('<img>', {
            id: 'logoImg',
            src: "img/" + fileName
        });
        $('#imgContainer').empty().append(img);

        // Set buttons
        var containsSport = team.getSportInLogo;
        var containsAbbreviation = team.getAbInLogo;
        const revLeg = $('#revLeg');
        const revAbb = $('#revAbb');
        if (containsSport) {
            revLeg.css({ opacity: 0, pointerEvents: 'none' });
        } else {
            revLeg.css({ opacity: 1, pointerEvents: 'auto' });
        }
        if (containsAbbreviation) {
            revAbb.css({ opacity: 0, pointerEvents: 'none' });
        } else {
            revAbb.css({ opacity: 1, pointerEvents: 'auto' });
        }

        // Add listeners
        revLeg.off('click').on('click', function() {
            $('#teamNameInput').focus();
            $('#leagueDisplay').text(team.getLeauge);
            $(this).css({ opacity: 0, pointerEvents: 'none' });
            tempScore -= 10;
            updateLongScoreDisplay(tempScore);
        });
        revAbb.off('click').on('click', function() {
            $('#teamNameInput').focus();
            $('#abbreviationDisplay').text(team.getAbbreviation);
            $(this).css({ opacity: 0, pointerEvents: 'none' });
            tempScore -= 20;
            updateLongScoreDisplay(tempScore);
        });

       // Set title(s)
       $('#leagueDisplay').text('');
       $('#abbreviationDisplay').text('');
       $('#cityDisplay').text('');
       $('#nameDisplay').text('');

        // Shared correct-answer handler
        function handleCorrectAnswer(showCanonicalName) {
            if (lockBox) return;
            totalScoreNoStreak += tempScore;
            if (showCanonicalName) {
                showTempNameDisplay(team.getNames[0]);
            }
            const rawScore = tempScore;
            if (tempScore === 100) {
                streak++;
                addToAnswerHistory(0, team.getLeauge, rawScore);
            } else if (tempScore >= 98) {
                streak++;
                addToAnswerHistory(1, team.getLeauge, rawScore);
            } else if (tempScore >= 70) {
                streak++;
                addToAnswerHistory(2, team.getLeauge, rawScore);
            } else if (tempScore >= 30) {
                streak = 0;
                addToAnswerHistory(3, team.getLeauge, rawScore);
            } else {
                streak = 0;
                addToAnswerHistory(4, team.getLeauge, rawScore);
            }
            updateStreakDisplay();
            if (streak >= 120) {
                tempScore += 45;
            } else if (streak >= 110) {
                tempScore += 40;
            } else if (streak >= 100) {
                tempScore += 30;
            } else if (streak >= 75) {
                tempScore += 25;
            } else if (streak >= 50) {
                tempScore += 20;
            } else if (streak >= 25) {
                tempScore += 15;
            } else if (streak >= 10) {
                tempScore += 10;
            } else if (streak >= 5) {
                tempScore += 5;
            }
            totalScore += tempScore;
            $('#scoreDisplay').text(totalScore);
            showTempScoreDisplay(tempScore);
            clearInterval(scoreInterval);
            handleNextTeam();
        }

        // Wait for user input
        $('#idk').off('click').on('click', function() {
            if (!lockBox) {
                lockBox = true;
                $('#teamNameInput').addClass('flash-wrong');
                $('#leagueDisplay').text(team.getLeauge);
                $('#abbreviationDisplay').text(team.getAbbreviation);
                $('#cityDisplay').text(team.getCity);
                $('#nameDisplay').text(team.getNames[0]);
                setTimeout(function() {
                    lockBox = false;
                    streak = 0;
                    updateStreakDisplay();
                    addToAnswerHistory(5, team.getLeauge, 0);
                    handleNextTeam();
                }, 2000);
            }
        });

        if (debugMode) {
            $('#skip').off('click').on('click', function() {
                handleCorrectAnswer(false);
            });
        }

        const teamNameInput = $('#teamNameInput');
        teamNameInput.off('input').on('input', function() {
            var textBoxText = teamNameInput.val().toLowerCase();
            var teamNames = team.getNames.map(name => name.toLowerCase());
            if (!lockBox && teamNames.some(name => name === textBoxText)) {
                handleCorrectAnswer(textBoxText !== teamNames[0]);
            }
        });
    }
});

// Handle temp score display
function showTempScoreDisplay(points) {
    const el = $('#tempScoreDisplay');
    el.removeClass('show');
    el[0].offsetHeight; // force reflow to restart animation
    el.text(`+${points}`);
    el.addClass('show');
}

// Handle temp name display
function showTempNameDisplay(name) {
    const el = $('#tempNameDisplay');
    el.removeClass('show');
    el[0].offsetHeight; // force reflow to restart animation
    el.text(name);
    el.addClass('show');
}

// Shuffle map helper funct
function shuffleMap(map) {
    const entries = Array.from(map.entries());
    for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return new Map(entries);
}

// Update long score display helper
function updateLongScoreDisplay(score) {
    let nuts = $('div#longScoreDisplay');
    nuts.css('width', `${score}%`);
    if (score === 100) {
        nuts.css('background-color', `#8a46c6`);
    } else if (score >= 98) {
        nuts.css('background-color', `#46bdc6`);
    } else if (score >= 70) {
        nuts.css('background-color', `#34a853`);
    } else if (score >= 30) {
        nuts.css('background-color', `#fbbc04`);
    } else {
        nuts.css('background-color', `#ff6d01`);
    }
}

// Add to answer history helper
function addToAnswerHistory(stage, league, rawScore) {
    // Accumulate per-league stats
    if (league && leagueStats[league] !== undefined) {
        if (stage === 5) {
            leagueStats[league].missed++;
        } else {
            leagueStats[league].correct++;
            leagueStats[league].totalScore += rawScore || 0;
        }
    }

    var color = "";
    switch (stage) {
        case (0): color = "#8a46c6"; break;
        case (1): color = "#46bdc6"; break;
        case (2): color = "#34a853"; break;
        case (3): color = "#fbbc04"; break;
        case (4): color = "#ff6d01"; break;
        case (5): color = "#ea4335"; break;
    }

    var answerSect = $('<div>', {
        class: `historicAnswer stage-${stage}`
    }).css('background-color', color);
    $('#answerHistory').append(answerSect);
}

// High score leaderboard helpers
function getHighScores(key) {
    const storageKey = key || 'highScores';
    try {
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch(e) {
        return [];
    }
}

function saveHighScore(name, score, key) {
    const storageKey = key || 'highScores';
    const scores = getHighScores(storageKey);
    scores.push({ name: name || 'Anonymous', score });
    scores.sort((a, b) => b.score - a.score);
    scores.splice(10);
    localStorage.setItem(storageKey, JSON.stringify(scores));
    return scores;
}

function getLeaderboardKey() {
    return 'highScores_' + [...selectedLeagues].sort().join('_');
}

function updateStartScreenHighScore() {
    const key = getLeaderboardKey();
    const scores = getHighScores(key);
    const container = $('#startLeaderboard').empty();
    if (scores.length === 0) return;

    container.append('<div class="lb-title">Top Scores</div>');
    const ol = $('<ol></ol>');
    scores.forEach((entry, i) => {
        ol.append(`<li>
            <span class="lb-rank">${i + 1}</span>
            <span class="lb-name">${entry.name}</span>
            <span class="lb-score">${entry.score}</span>
        </li>`);
    });
    container.append(ol);
}

function updateTeamCountDisplay() {
    let total = 0;
    for (const lg of selectedLeagues) total += leagueCounts[lg];
    $('#teamCountDisplay').text(`${total} teams selected`);
    updateStartScreenHighScore();
}

function renderLeagueBreakdown() {
    const container = $('#leagueBreakdown').empty();
    const leagues = Object.keys(leagueStats);
    if (leagues.length === 0) return;

    $('<div class="lbdTitle">League Breakdown</div>').appendTo(container);

    for (const lg of leagues) {
        const stats = leagueStats[lg];
        const avgScore = stats.correct > 0 ? (stats.totalScore / stats.correct).toFixed(2) : '—';
        const pctCorrect = stats.correct / stats.count * 100;
        const row = $('<div class="lbdRow"></div>');
        row.append(`<span class="lbdLeague">${lg}</span>`);
        row.append(`<div class="lbdBarWrap"><div class="lbdBar" style="width:${pctCorrect.toFixed(1)}%"></div></div>`);
        row.append(`<span class="lbdInfo">${stats.correct}/${stats.count} · avg ${avgScore}</span>`);
        container.append(row);
    }
}

function renderLeaderboard(scores, editIndex, key) {
    const list = $('#leaderboardList').empty();
    scores.forEach(function(entry, i) {
        const isNew = i === editIndex;
        const nameCell = isNew
            ? `<input class="lb-name-input" type="text" value="Anonymous" maxlength="20" autocomplete="off">`
            : `<span class="lb-name">${entry.name}</span>`;
        const li = $(`<li class="${isNew ? 'lb-entry-new' : ''}">
            <span class="lb-rank">${i + 1}</span>
            ${nameCell}
            <span class="lb-score">${entry.score}</span>
        </li>`);
        list.append(li);
    });

    if (editIndex !== null && editIndex >= 0) {
        const input = $('#leaderboardList .lb-name-input');
        input.focus().select();

        function commitName() {
            const newName = input.val().trim() || 'Anonymous';
            const stored = getHighScores(key);
            if (stored[editIndex]) {
                stored[editIndex].name = newName;
                localStorage.setItem(key, JSON.stringify(stored));
            }
            input.replaceWith(`<span class="lb-name lb-entry-new">${newName}</span>`);
            updateStartScreenHighScore();
        }

        input.on('keydown', function(e) {
            if (e.key === 'Enter') {
                input.off('blur');
                commitName();
            }
        });
        input.on('blur', commitName);
    }
}