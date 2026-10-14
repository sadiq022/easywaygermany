"""
Blog SEO cleanup for easywaygermany (Supabase `blogs` table).

Usage:
  python -X utf8 blog_seo_cleanup.py            # dry-run: prints summary, writes proposed rows to ./proposed.json
  python -X utf8 blog_seo_cleanup.py --apply    # PATCHes changed fields (service key from project .env)

Idempotent: the CTA/Related footer is wrapped in marker comments and replaced on re-run.
"""
import json, os, re, sys, urllib.request, urllib.parse

PROJECT = 'd:/Nexa Solutions/easywaygermany'
HERE = os.path.dirname(os.path.abspath(__file__))
APPLY = '--apply' in sys.argv


def load_env():
    env = {}
    for line in open(os.path.join(PROJECT, '.env'), encoding='utf8'):
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


ENV = load_env()
URL = ENV['SUPABASE_URL'].rstrip('/')
SERVICE = ENV['SUPABASE_SERVICE_KEY']
ANON = ENV['VITE_SUPABASE_ANON_KEY']


def rest(method, path, body=None, key=SERVICE):
    req = urllib.request.Request(
        URL + '/rest/v1/' + path,
        data=json.dumps(body).encode('utf8') if body is not None else None,
        method=method,
        headers={'apikey': key, 'Authorization': 'Bearer ' + key,
                 'Content-Type': 'application/json', 'Prefer': 'return=minimal'})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
        return json.loads(data) if data and method == 'GET' else None


rows = rest('GET', 'blogs?select=*&is_published=eq.true&order=id')
by = {r['id']: r for r in rows}
SLUG = {i: r['slug'] for i, r in by.items()}
TITLE = {i: r['title'] for i, r in by.items()}


def L(i, text=None):
    return f'<a href="/blog/{SLUG[i]}">{text or TITLE[i]}</a>'


# ───────────────────────── metadata (only fills / replaces what is listed) ─────────────────────────
META = {
    1:  ('Masters in Germany: Complete Guide for 2026',
         'Everything you need for a Masters in Germany: tuition-free public universities, admission requirements, APS, deadlines, costs and the visa steps.',
         'masters in germany'),
    2:  ('German Language Levels A1 to C1: Learning Path',
         'Understand CEFR levels A1 to C1, how long each takes, which German exam universities accept, and how to plan your learning before moving to Germany.',
         'german language levels'),
    3:  ('How the German University System Works',
         'Universities vs. universities of applied sciences, semesters, ECTS credits, exams and degrees: how studying in Germany works for international students.',
         'german university system'),
    4:  ('Working While Studying in Germany: 2026 Rules',
         'International students may work 140 full days a year in Germany. Learn the rules, student job types, minimum wage, taxes and post-study work options.',
         'working while studying in germany'),
    5:  ('APS Certificate for Indian Students: Complete Guide',
         'Step-by-step APS certificate guide for Indian students: documents, fees, processing time, the interview and common mistakes before applying to Germany.',
         'aps certificate for indian students'),
    7:  ('How to Write a SOP for Germany: Step-by-Step',
         'Learn how to write a Statement of Purpose for German universities: structure, what admissions committees expect and the mistakes that get SOPs rejected.',
         'sop for germany'),
    8:  ('IELTS Score for Masters in Germany: Complete Guide',
         'Which IELTS score do you need for a Masters in Germany? See what 5.5, 6.0, 6.5 and 7.0 unlock and how IELTS affects your admission chances.',
         'ielts score for masters in germany'),
    9:  ('Engineering Management Masters in Germany',
         'Mechanical engineer? Explore engineering management Masters at German public universities: courses, admission requirements and career prospects.',
         'engineering management masters germany'),
    10: ('How to Find Student Accommodation in Germany',
         'Practical tips to find student housing in Germany: the best platforms, dorm vs. shared flat, scams to avoid and how to write messages that get replies.',
         'student accommodation in germany'),
    12: ('Is Education Really Free in Germany? Real Costs',
         'Tuition is free at most public universities, but living is not. See the real monthly costs international students should plan for in Germany.',
         'is education free in germany'),
    18: ('Public vs Private Universities for Masters in Germany',
         'Compare public and private universities in Germany for a Masters: costs, recognition, admission and career outcomes for international students.',
         'public vs private universities germany'),
    19: ('TU9 Universities in Germany: Complete Overview',
         "What is TU9? Meet Germany's nine leading technical universities and see how they compare with other public universities for admission and careers.",
         'tu9 universities germany'),
    20: ('CV for Masters in Germany: Structure and Tips',
         'How to structure a European-style CV for German Masters applications: sections, format, common mistakes and tips to boost your chances.',
         'cv for masters in germany'),
    21: ('First Steps After Arriving in Germany as a Student',
         'Your checklist for the first weeks in Germany: city registration (Anmeldung), bank account, health insurance, student ID and residence permit.',
         'arriving in germany as a student'),
    22: ('Public Holidays in Germany 2026: Complete Guide',
         'Plan your year with the 2026 public holidays in Germany, which are nationwide, which vary by state, and what closes on those days.',
         'public holidays in germany 2026'),
    23: ('Student Life in Germany: What to Expect',
         'What student life in Germany is really like: campus culture, housing, costs, part-time work and career prospects at public universities.',
         'student life in germany'),
    24: ('Free Resources to Learn German: Best YouTube Channels',
         'The best free YouTube channels and online platforms for learning German from A1 to C1, handpicked for students heading to Germany.',
         'learn german for free'),
    28: ('How Much Can Students Earn in Germany?',
         'Realistic part-time earnings for international students in Germany: popular jobs, legal work limits and how pay compares to living costs.',
         'student jobs in germany'),
    30: ("Germany's Part-Time Work Debate: What It Means",
         "Germany is debating limits on 'lifestyle part-time work'. Here is what the CDU proposal says and what it could mean for workers and students.",
         'germany part-time work'),
    33: ('Public Universities in Germany for Data Science',
         'Looking for a Masters in Data Science in Germany? Compare public universities, programs, admission requirements and career prospects.',
         'data science masters in germany'),
    34: ('Budget 2026: TCS Changes for Studying in Germany',
         'India\'s Budget 2026 cuts TCS on education remittances. See what it means for blocked account payments and funding your studies in Germany.',
         'tcs on education remittance'),
}

# Descriptions that exceed ~160 chars (truncated in Google) — shortened, same meaning.
DESC_ONLY = {
    29: 'Masters in Germany without IELTS: English-taught programs, accepted alternatives, universities and requirements for Indian students. Updated 2026.',
    35: 'Can you work full-time while studying in Germany? No, but the 140-day rule gives flexibility. 2026 rules, €13.90 minimum wage, Werkstudent and Minijob limits.',
    36: 'Can Indian students get a Germany student visa without a blocked account? Yes, with 4 legal alternatives. Complete 2026 guide from EasyWay Germany.',
    49: 'The complete 2026 guide to a Masters in Germany for Indian students: how to apply, requirements, public universities and the admission timeline.',
    50: "Is a Masters in Germany free for international students? See exactly what you pay, what you don't, and the one state that charges tuition.",
    51: 'Masters in Germany cost in Indian Rupees: tuition, semester fees, living costs, blocked account and 1-year vs 2-year program costs.',
    52: 'Over 1,800 Masters programs in Germany are taught in English. Learn how to find the right one without needing German language skills.',
    53: "Do Indian students get jobs in Germany after a Masters? A realistic look at outcomes, the 18-month job-search visa and whether it's worth it.",
    54: 'The complete roadmap to study in Germany from India, from choosing a program to landing, including how to do it on a tight budget.',
    55: 'How to get a DAAD scholarship for a Masters in Germany as an Indian student: eligibility, application timeline and what it covers.',
    57: 'Looking for the best consultancy for a Masters in Germany? Meet EasyWay Germany, a team that studied and now works in Germany.',
}

TITLE_FIX = {5: 'APS Certificate Process for Indian Students: Complete Guide'}

# ───────────────────────── expanded content for the four thin posts ─────────────────────────
NEW_CONTENT = {}

NEW_CONTENT[1] = f"""<p>Germany is one of the most popular destinations in the world for a Master's degree. Most public universities charge no tuition fees, the academic standard is high, and graduates can stay for 18 months after finishing their degree to look for a job. This guide explains how a Masters in Germany works, what you need to apply, and how to plan the process from start to finish.</p>

<h2>Why Study a Masters in Germany?</h2>
<ul>
  <li><strong>No tuition at most public universities.</strong> Students pay only a semester contribution, usually between €100 and €350, which often includes a public transport ticket. Baden-Württemberg is the notable exception, where non-EU students pay €1,500 per semester. Read our guide on whether a Masters in Germany is really free: {L(50, 'Is a Masters in Germany free?')}.</li>
  <li><strong>Programs taught in English.</strong> Over 1,800 Masters programs are taught in English, so German is not required for many courses. See {L(52, 'Masters in Germany taught in English')}.</li>
  <li><strong>Strong universities.</strong> TU Munich, RWTH Aachen, TU Dresden, KIT, Heidelberg and many others are internationally respected, especially in engineering, computer science and the natural sciences.</li>
  <li><strong>Career options.</strong> After graduating you can apply for an 18-month residence permit to search for a job that matches your degree.</li>
</ul>

<h2>Admission Requirements for a Masters in Germany</h2>
<p>Requirements differ by university and program, but most ask for:</p>
<ul>
  <li>A recognised Bachelor's degree in a relevant field. If your degree is only three years long, check {L(48, 'whether you can study in Germany with a 3-year Bachelor\'s')}.</li>
  <li>Good academic grades. Popular programs are competitive and may have a minimum GPA.</li>
  <li>Proof of language proficiency: English (IELTS, TOEFL, Duolingo or a Medium of Instruction certificate where accepted) or German for German-taught programs.</li>
  <li>The {L(5, 'APS certificate')} for Indian students.</li>
  <li>A Statement of Purpose or motivation letter. See {L(7, 'how to write a SOP for Germany')}.</li>
  <li>A European-style CV: {L(20, 'CV structure for Masters in Germany')}.</li>
  <li>Letters of recommendation, and sometimes GRE, GMAT or a program-specific test.</li>
</ul>

<h2>How to Apply, Step by Step</h2>
<ol>
  <li><strong>Shortlist programs.</strong> Choose programs that match your degree and profile. {L(44, 'Most students apply to 8 to 12 universities')} across ambitious, target and safer options.</li>
  <li><strong>Check deadlines.</strong> Many winter-semester (October start) deadlines fall between May and July, while summer-semester (April start) deadlines often fall between November and January. Always confirm on the university page.</li>
  <li><strong>Get your APS and language proof ready.</strong> The APS can take several weeks, so start early.</li>
  <li><strong>Apply through the right portal.</strong> Some universities use {L(42, 'uni-assist')}, others have their own application portal.</li>
  <li><strong>Receive your admission letter</strong> and accept the offer.</li>
  <li><strong>Open a blocked account and apply for the visa.</strong> See {L(36, 'blocked account alternatives for the student visa')}.</li>
</ol>

<h2>How Much Does a Masters in Germany Cost?</h2>
<p>Even without tuition, you must show that you can fund your living costs. For 2026 the blocked account requirement is €11,904 per year (€992 per month). Realistic living costs are roughly €800 to €1,200 per month depending on the city, plus health insurance. A full breakdown in rupees is in our guide to the {L(51, 'Masters in Germany cost in Indian Rupees')}.</p>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li>Starting too late. Plan at least 9 to 12 months before your intended start date.</li>
  <li>Applying to only one or two universities.</li>
  <li>Sending a generic SOP instead of one tailored to each program.</li>
  <li>Not checking whether your degree is recognised. See {L(43, 'anabin degree recognition')}.</li>
</ul>

<p>For a full roadmap tailored to Indian students, read our {L(49, 'complete Masters in Germany guide for Indian students')} and the {L(54, 'step-by-step guide to studying in Germany from India')}.</p>
"""

NEW_CONTENT[2] = f"""<p>Whether you plan to study in English or German, learning German will make daily life in Germany easier and open up more job opportunities. Language ability is measured on the Common European Framework of Reference (CEFR), which has six levels from A1 to C2. This guide explains what each level means, how long it takes and which level you need for university.</p>

<h2>The CEFR Levels Explained</h2>
<ul>
  <li><strong>A1 (beginner):</strong> You can introduce yourself, order food and handle very simple conversations.</li>
  <li><strong>A2 (elementary):</strong> You can talk about routine topics such as shopping, family and work, and manage simple everyday tasks.</li>
  <li><strong>B1 (intermediate):</strong> You can deal with most situations while living in Germany and describe experiences and plans. Many Studienkolleg and language-course admissions start around this level.</li>
  <li><strong>B2 (upper intermediate):</strong> You can follow complex texts and talk fluently with native speakers. Many employers expect at least B2.</li>
  <li><strong>C1 (advanced):</strong> You can use German flexibly for academic and professional purposes. This is the usual requirement for German-taught degree programs.</li>
  <li><strong>C2 (proficient):</strong> Near-native understanding. Rarely required for admission.</li>
</ul>

<h2>How Long Does It Take?</h2>
<p>It depends on your study time, your mother tongue and the course format. As a rough guide, learners studying around 5 to 8 hours a week often need about three to six months per level at the beginner stages, and longer as the levels get harder. Reaching B2 usually takes around a year of consistent study, and C1 another six to twelve months. An intensive course in Germany or online can speed this up considerably.</p>

<h2>Which German Exam Do Universities Accept?</h2>
<p>For German-taught programs, universities typically accept one of these certificates at C1 level:</p>
<ul>
  <li><strong>TestDaF</strong> (usually TDN 4 in all four sections)</li>
  <li><strong>DSH</strong> (usually DSH-2)</li>
  <li><strong>Goethe-Zertifikat C1</strong> or <strong>telc Deutsch C1 Hochschule</strong></li>
</ul>
<p>Requirements vary, so always check your chosen program's admission page. For English-taught programs you normally need only English proof, but German remains very useful. Read more in {L(46, 'Is German mandatory for studying in Germany?')} and {L(59, 'Can you survive in Germany without speaking German?')}.</p>

<h2>A Practical Learning Plan</h2>
<ol>
  <li>Start with A1 and learn pronunciation, basic grammar and everyday vocabulary.</li>
  <li>Take a structured course (online or classroom) so that your progress is tested regularly.</li>
  <li>Practise daily with listening and speaking, not only grammar exercises.</li>
  <li>Take a mock exam before booking the real test.</li>
  <li>Keep learning after you arrive. Immersion in Germany is the fastest way to reach B2 and C1.</li>
</ol>
<p>You can start for free with the resources in {L(24, 'free YouTube channels and resources for learning German')}.</p>
"""

NEW_CONTENT[3] = f"""<p>The German higher education system works differently from systems in India, the UK or the USA. Knowing the basics before you apply will help you choose the right type of institution, understand the academic calendar and be ready for the way courses are taught.</p>

<h2>Types of Higher Education Institutions</h2>
<ul>
  <li><strong>Universities (Universitäten):</strong> Research-oriented institutions offering a broad range of subjects and degrees up to the doctorate. This includes the technical universities. Read about the leading ones in {L(19, 'TU9 universities in Germany')}.</li>
  <li><strong>Universities of Applied Sciences (Hochschulen für Angewandte Wissenschaften / Fachhochschulen):</strong> Practice-oriented, with smaller classes, projects and internships built into the program.</li>
  <li><strong>Colleges of art, film and music:</strong> Specialist institutions with their own admission procedures, often including portfolios or auditions.</li>
  <li><strong>Private universities:</strong> They charge tuition fees. See {L(18, 'public vs private universities for a Masters in Germany')}.</li>
</ul>

<h2>Degrees and ECTS Credits</h2>
<p>Most programs follow the Bologna system. A Bachelor's degree usually takes six to eight semesters (180 to 240 ECTS credits), and a Master's takes two to four semesters (60 to 120 ECTS credits). One academic year corresponds to about 60 ECTS credits. Some subjects, such as medicine and law, still end with a state examination instead.</p>

<h2>The Academic Year</h2>
<p>The year is split into two semesters:</p>
<ul>
  <li><strong>Winter semester:</strong> October to March, with lectures from about mid-October to February. This is the main intake for most programs.</li>
  <li><strong>Summer semester:</strong> April to September, with lectures from April to July. Fewer programs admit students for this intake. Compare them in {L(45, 'winter vs summer intake')}.</li>
</ul>

<h2>How Teaching and Exams Work</h2>
<ul>
  <li><strong>Lectures</strong> are large sessions where the professor presents the material.</li>
  <li><strong>Seminars and tutorials</strong> are smaller groups for discussion, presentations and exercises.</li>
  <li><strong>Independent study</strong> is expected. Attendance is often not checked, but you are responsible for keeping up.</li>
  <li><strong>Exams</strong> take place at the end of the semester and may be written, oral or project-based. Many programs limit how often you can retake a failed exam.</li>
</ul>

<h2>Costs and Student Services</h2>
<p>Most public universities charge no tuition, but each semester you pay a contribution (typically €100 to €350) that covers student services and often a local transport ticket. Learn more in {L(12, 'Is education really free in Germany?')}.</p>

<h2>Applying as an International Student</h2>
<p>Many universities process international applications through {L(42, 'uni-assist')}, while others use their own portal. Your previous degree must be recognised, which you can check using {L(43, 'anabin')}. For the full process, see our {L(1, 'complete guide to a Masters in Germany')}.</p>
"""

NEW_CONTENT[4] = f"""<p>International students in Germany are allowed to work alongside their studies, which can help with living expenses and give you valuable work experience. The rules are fixed by law, so it is important to know exactly how much you may work before you take a job.</p>

<h2>How Many Days Can You Work?</h2>
<p>Students from outside the EU may work <strong>140 full days or 280 half days per calendar year</strong>. A half day is a day of up to four hours. These limits were raised from 120 and 240 days, so older articles that mention the lower numbers are out of date. We explain the details and common questions in {L(35, 'Can you do full-time work while studying in Germany?')}.</p>
<ul>
  <li>Work as a student assistant at your own university is generally not counted toward the limit, but confirm with the foreigners' office (Ausländerbehörde).</li>
  <li>Mandatory internships that are part of your study program are normally not counted either.</li>
  <li>Freelance or self-employed work is generally not allowed on a student residence permit without separate approval.</li>
  <li>Breaking the limit can put your residence permit at risk, so keep a record of the days you work.</li>
</ul>

<h2>Finding Student Jobs</h2>
<p>Common jobs for international students include:</p>
<ul>
  <li>Research or teaching assistant at the university (HiWi)</li>
  <li>Working student (Werkstudent) positions in a company related to your field</li>
  <li>Waitstaff in restaurants and cafes</li>
  <li>Retail, delivery and warehouse jobs</li>
  <li>Internships related to your field of study</li>
</ul>
<p>Pay depends on the job, but the statutory minimum wage is €13.90 per hour in 2026. See {L(28, 'how much a student can earn in Germany')} for realistic income and cost-of-living numbers.</p>

<h2>Minijobs and Werkstudent Jobs</h2>
<p>A Minijob has a monthly earnings limit (€603 in 2026) and is simple for both sides. A Werkstudent job usually allows up to 20 hours per week during the semester, with reduced social-security contributions, and often pays better. Remember that the hours still count toward your 140-day limit.</p>

<h2>Taxes and Insurance</h2>
<p>Students with low incomes may pay little or no income tax, because every resident has a basic tax-free allowance of roughly €12,000 per year. You should still register for a tax number and understand how social contributions apply to your job type.</p>

<h2>Working After Graduation</h2>
<p>After your degree, Germany offers an 18-month residence permit to look for a job that matches your qualification, during which you can work without the student restrictions. Read about career outcomes in {L(53, 'jobs for Indian students after a Masters in Germany')}.</p>

<p>Part-time work should support your studies, not replace your funding. You still need proof of funds, such as a blocked account, to get your visa. See {L(36, 'blocked account alternatives for the German student visa')}.</p>
"""


NEW_CONTENT[63] = f"""<p>Germany has a large and well-paid job market, and many industries report shortages of qualified people. That does not mean every graduate walks into a job. Competition for entry-level roles can be strong, especially in big cities and popular fields. This article gives a realistic picture of how competitive the German job market is for international graduates and what improves your chances.</p>

<h2>Where Demand Is Strong and Where It Is Tough</h2>
<p>Demand is strongest in engineering, IT and software, data and AI, healthcare, skilled trades and some areas of research. Roles in marketing, general business and media tend to be more competitive and more dependent on German language skills. The shortage across the economy is real, as we explain in {L(62, 'Skilled worker shortage in Germany: what students should know')}, but it is uneven across fields and regions.</p>

<h2>The Main Factors Employers Look At</h2>
<ul>
  <li><strong>Relevant skills and projects.</strong> A strong thesis, portfolio, GitHub profile or project work often matters more than grades alone.</li>
  <li><strong>Work experience in Germany.</strong> Internships and Werkstudent jobs give you references, a network and a clear understanding of German workplaces.</li>
  <li><strong>German language ability.</strong> Many employers expect at least B1 or B2 even when the team works in English. It also widens your options a lot. See {L(46, 'whether German is mandatory for studying in Germany')}.</li>
  <li><strong>Field and location.</strong> Tech hubs hire many international graduates, while smaller regions may rely more on German. Compare cities in {L(61, 'best cities in Germany for IT and computer science students')}.</li>
</ul>

<h2>How Long Does the Job Search Take?</h2>
<p>There is no fixed timeline. Some students receive an offer before graduating, while others search for several months. Germany gives international graduates an 18-month residence permit to look for a job that matches their degree, so planning the search early makes full use of that time. Our guide on {L(53, 'jobs for Indian students after a Masters in Germany')} covers realistic outcomes in more detail.</p>

<h2>How to Improve Your Chances</h2>
<ol>
  <li>Choose a program with strong industry links and a practical component.</li>
  <li>Work as a Werkstudent or intern during your studies. Keep the {L(4, 'work-limit rules for students')} in mind.</li>
  <li>Write your thesis with a company if your program allows it.</li>
  <li>Learn German steadily, starting from day one. Use the {L(2, 'A1 to C1 learning path')} to plan.</li>
  <li>Prepare a German-style CV and cover letter, and build your network on LinkedIn and Xing.</li>
  <li>Apply early. Do not wait until your final semester.</li>
</ol>

<h2>How Does It Compare With India?</h2>
<p>Salaries, work culture and long-term residence options differ from India. We compare them in {L(64, 'Germany job market vs India')}.</p>
"""

# ───────────────────────── footer: CTA + related guides ─────────────────────────
RELATED = {
    1: [49, 54, 41], 2: [46, 24, 59], 3: [19, 18, 45], 4: [35, 28, 53], 5: [54, 42, 36], 7: [20, 42, 5],
    8: [40, 29, 52], 9: [33, 56, 19], 10: [21, 23, 60], 12: [41, 50, 51], 18: [19, 3, 50], 19: [18, 3, 56],
    20: [7, 42, 44], 21: [60, 10, 23], 22: [23, 21, 58], 23: [21, 10, 28], 24: [46, 2, 59], 28: [35, 4, 47],
    29: [36, 40, 8], 30: [35, 28, 53], 33: [56, 61, 9], 34: [51, 55, 36], 35: [28, 4, 47], 36: [54, 51, 5],
    39: [5, 42, 44], 40: [29, 8, 42], 41: [50, 49, 55], 42: [5, 44, 43], 43: [42, 48, 5], 44: [42, 45, 49],
    45: [44, 54, 42], 46: [52, 2, 59], 47: [28, 35, 53], 48: [43, 49, 44], 49: [50, 51, 54], 50: [41, 49, 51],
    51: [50, 12, 34], 52: [56, 49, 46], 53: [62, 63, 64], 54: [49, 5, 42], 55: [41, 49, 51], 56: [33, 49, 61],
    57: [49, 54, 5], 58: [21, 60, 10], 59: [46, 2, 23], 60: [21, 10, 58], 61: [56, 33, 62], 62: [63, 64, 53],
    63: [62, 64, 53], 64: [53, 62, 63],
}
CLUSTER = {}
for ids, kind in [
    ([1, 3, 5, 7, 8, 9, 18, 19, 20, 29, 33, 39, 40, 41, 42, 43, 44, 45, 48, 49, 50, 52, 54, 56, 57], 'admission'),
    ([12, 34, 36, 51, 55], 'money'),
    ([10, 21, 22, 23, 58, 59, 60, 61], 'life'),
    ([4, 28, 30, 35, 47, 53, 62, 63, 64], 'work'),
    ([2, 24, 46], 'language'),
]:
    for i in ids:
        CLUSTER[i] = kind
CTA_LEAD = {
    'admission': "Choosing universities, writing a strong SOP and getting the APS right all have to happen in the right order. EasyWay Germany's consultants live in Dresden and have helped students from India, Bangladesh and Nepal with university shortlisting, SOP and LOR writing, and CV preparation.",
    'money': "Funding rules, blocked accounts and visa documents are where many applications go wrong. EasyWay Germany's consultants live in Dresden and guide students through the blocked account, visa SOP and embassy paperwork.",
    'life': "Settling in is much easier when you know what to expect. EasyWay Germany's consultants live in Dresden and help students prepare for arrival, from admission and visa to housing and the first weeks in Germany.",
    'work': "Planning a career in Germany starts with choosing the right program. EasyWay Germany's consultants live in Dresden and help students pick programs and universities with strong career prospects.",
    'language': "Language requirements differ by program, and choosing the wrong one can cost you a full intake. EasyWay Germany's consultants live in Dresden and help students shortlist programs that match their language profile.",
}
M_START, M_END = '<!-- ew-seo-footer:start -->', '<!-- ew-seo-footer:end -->'


def footer_for(i, content):
    body = re.sub(re.compile(re.escape(M_START) + r'.*?' + re.escape(M_END), re.S), '', content)
    has_cta = bool(re.search(r'href="(?:https://easywaygermany\.com)?/services', body))
    parts = [M_START]
    if not has_cta:
        parts.append(
            '<h2>Need Help With Your Germany Application?</h2>\n'
            f'<p>{CTA_LEAD[CLUSTER.get(i, "admission")]} Explore our <a href="/services">study in Germany services</a> '
            'or <a href="/contact">book a free consultation</a>.</p>')
    rel = [r for r in RELATED.get(i, []) if r in SLUG and r != i and f'/blog/{SLUG[r]}' not in body]
    if rel:
        parts.append('<h2>Related Guides</h2>\n<ul>\n' + '\n'.join(f'  <li>{L(r)}</li>' for r in rel) + '\n</ul>')
    parts.append(M_END)
    if len(parts) == 2:
        return body, False
    block = '\n'.join(parts) + '\n'
    m = re.search(r'<script type="application/ld\+json"', body)
    if m:
        return body[:m.start()] + block + '\n' + body[m.start():], True
    return body.rstrip() + '\n\n' + block, True


# ───────────────────────── content clean-ups ─────────────────────────
def norm_words(s):
    return set(re.findall(r'[a-z0-9]+', re.sub(r'<[^>]+>', ' ', s).lower())) - {'the', 'a', 'in', 'to', 'for', 'of', 'and', 'guide', 'complete'}


def fix_h1(i, content, title):
    """Page template already renders the title as the only <h1>."""
    def repl(m):
        inner = m.group(2)
        a, b = norm_words(inner), norm_words(title)
        sim = len(a & b) / max(1, len(a | b))
        return '' if sim >= 0.5 else f'<h2{m.group(1)}>{inner}</h2>'
    out = re.sub(r'<h1([^>]*)>(.*?)</h1>\s*', repl, content, flags=re.S | re.I)
    return re.sub(r'<h([1-6])[^>]*>\s*(?:&nbsp;|<br\s*/?>|\s)*</h\1>\s*', '', out, flags=re.I)


def clean_content(i, content):
    c = content
    # old brand
    c = c.replace('Hi%20DeutschlandGenics%2C', 'Hi%20EasyWay%20Germany%2C')
    c = re.sub(r'DeutschlandGenics\s*\(DG\)', 'EasyWay Germany', c)
    c = re.sub(r'DeutschlandGenics', 'EasyWay Germany', c)
    c = c.replace('https://deutschlandgenics.com/blog/post/7', f'/blog/{SLUG[7]}')
    # copy-paste artifacts: internal links that point at chatgpt.com
    c = re.sub(r'https://chatgpt\.com/', '/', c)
    c = re.sub(r'[?&]utm_source=chatgpt\.com', '', c)
    # stale year in an in-body heading
    c = c.replace(' (2025 Guide)', '')
    return c


# ───────────────────────── build proposed rows ─────────────────────────
def alt_for(r):
    return f"{TITLE_FIX.get(r['id'], r['title'])} - EasyWay Germany guide"


proposed, report = {}, []
for i, r in by.items():
    new = {}
    title = TITLE_FIX.get(i, r['title'])
    if title != r['title']:
        new['title'] = title
    if i in META:
        st, sd, fk = META[i]
        assert len(sd) <= 160, (i, len(sd))
        assert len(st) <= 60, (i, len(st))
        new['seo_title'], new['seo_description'] = st, sd
        if not r.get('focus_keyword'):
            new['focus_keyword'] = fk
    if i in DESC_ONLY:
        assert len(DESC_ONLY[i]) <= 160, (i, len(DESC_ONLY[i]))
        new['seo_description'] = DESC_ONLY[i]
    if not r.get('image_alt'):
        new['image_alt'] = alt_for(r)

    content = NEW_CONTENT.get(i, r['content'] or '')
    content = clean_content(i, content)
    content = fix_h1(i, content, title)
    content, added = footer_for(i, content)
    if content != (r['content'] or ''):
        new['content'] = content
    if new:
        proposed[i] = new
        report.append((i, sorted(k for k in new), added))

json.dump(proposed, open(os.path.join(HERE, 'proposed.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(f'{len(proposed)} of {len(by)} posts change')
for i, keys, added in report:
    print(f'  {i:>3} {by[i]["slug"][:55]:<55} {",".join(keys)}{"  +footer" if added else ""}')

if not APPLY:
    print('\nDRY RUN - nothing written. Re-run with --apply.')
    sys.exit(0)

ok = 0
for i, fields in proposed.items():
    rest('PATCH', f'blogs?id=eq.{i}', fields)
    ok += 1
print(f'\nApplied {ok} updates.')
