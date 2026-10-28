"""
Publishes the 3 content files dropped in the project root on 2026-10-28:
  - "Blog how to apply masters germany from india.md"      -> new post
  - "Blog study in germany without english language.md"    -> new post
  - "Changes blocked account blog.md"                       -> edits to blog id 36

Also uploads the 2 matching .webp banners to Cloudinary and fixes a pre-existing
duplicate-FAQPage-schema bug (see note below) on blogs 29 and 36 while touching them.

Usage:
  python -X utf8 supabase/publish_oct28_blogs.py              # dry run: validates + prints a summary
  python -X utf8 supabase/publish_oct28_blogs.py --apply       # uploads images + writes to Supabase

Why the FAQPage fix: BlogDetail.jsx auto-extracts visible "<p><strong>Q?</strong>A</p>" FAQ pairs
and injects its own <script type="application/ld+json"> FAQPage via <Helmet> on every render. Several
older posts (confirmed live: 29, 36) ALSO keep a hand-written FAQPage <script> at the end of `content`,
so once React mounts, the page carries two FAQPage blocks (verified live via a headless-Chrome render:
blog 36 showed 6 Helmet-generated items vs 5 stale items in the content block). Removing the
content-embedded block leaves exactly one, auto-generated from the visible page text, so it can never
go stale again.
"""
import hashlib, json, os, re, sys, time, urllib.request, uuid

ROOT = 'D:/Nexa Solutions/easywaygermany'
APPLY = '--apply' in sys.argv

env = {}
for line in open(os.path.join(ROOT, '.env'), encoding='utf8'):
    line = line.strip()
    if line and not line.startswith('#') and '=' in line:
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

SB_URL, SB_KEY = env['SUPABASE_URL'].rstrip('/'), env['SUPABASE_SERVICE_KEY']
m = re.match(r'cloudinary://([^:]+):([^@]+)@(.+)$', env['CLOUDINARY_URL'])
CL_KEY, CL_SECRET, CLOUD = m.group(1), m.group(2), m.group(3)


def sb(method, path, body=None):
    req = urllib.request.Request(
        SB_URL + '/rest/v1/' + path, method=method,
        data=json.dumps(body).encode('utf8') if body is not None else None,
        headers={'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY,
                 'Content-Type': 'application/json', 'Prefer': 'return=minimal'})
    with urllib.request.urlopen(req, timeout=60) as r:
        d = r.read()
        return json.loads(d) if d and method == 'GET' else None


def cl_sign(params):
    s = '&'.join(f'{k}={params[k]}' for k in sorted(params)) + CL_SECRET
    return hashlib.sha1(s.encode('utf8')).hexdigest()


def cl_upload(path, public_id):
    params = {'public_id': public_id, 'overwrite': 'true', 'invalidate': 'true', 'timestamp': str(int(time.time()))}
    fields = dict(params, api_key=CL_KEY, signature=cl_sign(params))
    boundary = uuid.uuid4().hex
    body = b''
    for k, v in fields.items():
        body += f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    body += (f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{os.path.basename(path)}"\r\n'
              'Content-Type: image/webp\r\n\r\n').encode() + open(path, 'rb').read() + f'\r\n--{boundary}--\r\n'.encode()
    req = urllib.request.Request(f'https://api.cloudinary.com/v1_1/{CLOUD}/image/upload', data=body, method='POST',
                                  headers={'Content-Type': 'multipart/form-data; boundary=' + boundary})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())


def og_url(public_id):
    return f'https://res.cloudinary.com/{CLOUD}/image/upload/c_fill,w_1200,h_630,g_auto,f_jpg,q_auto/{public_id}.jpg'


def L(slug, text):
    return f'<a href="/blog/{slug}">{text}</a>'


SITE_SLUGS = {b['id']: b['slug'] for b in sb('GET', 'blogs?select=id,slug')}
BY_SLUG = {v: k for k, v in SITE_SLUGS.items()}


def must_exist(slug):
    assert slug in BY_SLUG, f'blog slug not found: {slug}'
    return slug


SOP_APS_GUIDE = must_exist('masters-in-germany-without-ielts-updated-guide-for-2026')
APS_GUIDE = must_exist('aps-certificate-process-for-indian-students-complete-2025-guide')
BLOCKED_ACCOUNT = must_exist('germany-student-visa-without-blocked-account-alternatives-2026')
HOW_TO_STUDY = must_exist('how-to-study-in-germany-from-india-step-by-step-guide-2026')
MASTERS_GUIDE = must_exist('masters-in-germany-for-indian-students-complete-guide-2026')
IS_GERMAN_MANDATORY = must_exist('is-german-mandatory-for-studying-in-germany')
SURVIVE_NO_GERMAN = must_exist('can-you-survive-in-germany-without-speaking-german')

NEW_SLUG_1 = 'how-to-apply-for-masters-in-germany-from-india'
NEW_SLUG_2 = 'study-in-germany-without-english-language'

# ───────────────────────── Post 1: How to Apply for Masters in Germany from India ─────────────────────────
POST1_CONTENT = f"""<p>If you've spent any time on Quora or Reddit looking up &ldquo;masters in Germany from India,&rdquo; you've probably ended up more confused than when you started. Half the answers are outdated, some are from people who never actually applied, and the rest assume you already know what APS or uni-assist means.</p>
<p>So let's start from zero and walk through the actual process &mdash; the one we use with students every single week &mdash; along with honest answers to the questions that come up the most: what if your CGPA isn't great, what if you want a second Masters, and what actually happens to your career after you graduate.</p>

<h2>The Real Timeline: What Applying to Germany Actually Looks Like</h2>
<p>Most students think of &ldquo;applying to Germany&rdquo; as one step. It isn't &mdash; it's about six, and each one has its own waiting period. Here's the honest breakdown:</p>
<ol>
<li><strong>Shortlist your universities and programs (Month 1&ndash;2).</strong> Don't start with &ldquo;best universities in Germany&rdquo; lists &mdash; start with your subject. A program that's ranked #3 globally but doesn't match your Bachelor's background will reject you faster than a mid-ranked program that's a perfect academic fit. Look at module structure, not just rankings.</li>
<li><strong>Get your APS certificate (Month 1&ndash;3, run in parallel).</strong> This is the one step every Indian student applying to Germany must go through, and it's also the one that trips people up the most because it has a long processing queue. {L(SOP_APS_GUIDE, 'APS (Akademische Pr&uuml;fstelle)')} verifies your academic documents and includes a short interview. Start this the moment you decide Germany is your plan &mdash; don't wait until you've picked your final university list.</li>
<li><strong>Prepare your application documents (Month 2&ndash;4).</strong> Your SOP, Letters of Recommendation, transcripts, CV, and language proof (English or German, depending on the program) all need to come together here. This is where most rejections actually happen &mdash; not because students aren't qualified, but because the SOP doesn't speak to the specific program.</li>
<li><strong>Submit applications (Month 4&ndash;6).</strong> Depending on the university, you'll apply either directly through the university's own portal or through uni-assist, a centralized platform many German universities use to pre-check international applications. Deadlines matter a lot here &mdash; German universities are strict about them in a way that can surprise students used to rolling admissions elsewhere.</li>
<li><strong>Receive your offer and open a blocked account (Month 6&ndash;8).</strong> Once you have an admission letter, you'll need to show proof of funds &mdash; this is the {L(BLOCKED_ACCOUNT, 'blocked account')}, currently requiring &euro;11,904 for the 2026 intake. This step has its own processing time, so don't leave it for the last minute.</li>
<li><strong>Apply for your student visa (Month 7&ndash;9).</strong> With your offer letter and blocked account confirmation in hand, you book a visa appointment at the German embassy or consulate. Appointment slots can be the real bottleneck here &mdash; in busy intake seasons, students sometimes wait 6&ndash;10 weeks just to get a slot.</li>
</ol>
<p>Add it all up, and most students should plan for <strong>9 to 12 months</strong> from &ldquo;I've decided on Germany&rdquo; to &ldquo;I'm boarding the flight.&rdquo; Starting late is the single biggest reason good applications fall apart under time pressure.</p>

<h2>&ldquo;But My CGPA Isn't That Great&rdquo; &mdash; Can a 7 Pointer Get In?</h2>
<p>This comes up in almost every consultation we do, so let's be direct about it: <strong>yes, a 7-pointer (or equivalent) can absolutely get into a German Masters program</strong> &mdash; but the path looks different than it would for a 9-pointer.</p>
<p>Germany, unlike the US or UK, doesn't lean heavily on a single CGPA cutoff. Technical universities in particular care about:</p>
<ul>
<li>Relevant project work and practical experience</li>
<li>A clear, specific SOP that connects your background to the exact program</li>
<li>Strong recommendation letters that speak to your abilities beyond grades</li>
<li>Any internships, research assistantships, or published work</li>
</ul>
<p>What changes with a lower CGPA is your target list. Highly selective programs at top-ranked technical universities will be a stretch. But Germany has dozens of excellent, less internationally &ldquo;famous&rdquo; universities with strong employment outcomes where a 7-pointer with a well-built profile is a completely normal, competitive applicant. The mistake students make is chasing only the 2&ndash;3 universities everyone's heard of and ignoring the 20 others that are just as good for their career.</p>

<h2>Can I Do a Second Masters in Germany from India?</h2>
<p>Yes, this is possible, and we get this question often from working professionals looking to pivot fields or go deeper into a specialization.</p>
<p>The key condition: your second Masters should generally be in a <strong>different field or specialization</strong> from your first one, or clearly add new academic value. Some German states and universities restrict access or funding for a second Masters in the exact same subject, since public education there is heavily subsidized and intended to support first qualifications.</p>
<p>In practice, this means:</p>
<ul>
<li>A second Masters moving from, say, Mechanical Engineering to Robotics or Mechatronics &mdash; generally fine</li>
<li>A second Masters in the identical subject with no new specialization &mdash; check with the specific university, as this can be restricted</li>
<li>A career-pivot second Masters (e.g., engineering background moving into Data Science or Management) &mdash; usually welcomed, and often makes for a stronger SOP since it shows clear intent</li>
</ul>
<p>If you're in this situation, get the specific university's policy confirmed before applying &mdash; it varies more than most other admission rules.</p>

<h2>Do You Need an Engineering Background?</h2>
<p>Not at all. Engineering graduates do have the largest number of Masters options in Germany simply because Germany's economy leans heavily on manufacturing and technical industries &mdash; but it is far from the only path.</p>
<p>If your Bachelor's is in Commerce, Economics, Business, or a related field, Germany has strong Masters programs in Finance, Management, and International Business &mdash; some taught entirely in English. In fact, <strong>a Masters in Finance from a German university carries real recognition back in India</strong>, particularly in roles connected to European markets, corporate finance, and multinational firms with German or EU operations.</p>
<p>What matters more than your specific Bachelor's subject is whether there's a logical academic bridge to your chosen Masters program. An admissions committee wants to see continuity, not a random jump.</p>

<h2>What Happens After You Graduate &mdash; Can You Actually Get a Job?</h2>
<p>This is the part that doesn't get talked about enough before students apply, and it's the part that actually matters most.</p>
<p>Germany gives international graduates an <strong>18-month post-study work visa</strong> to find a job related to your field &mdash; this alone puts Germany ahead of several competing study destinations that offer far shorter windows.</p>
<p>That said, job-hunting success depends heavily on a few real factors:</p>
<ul>
<li><strong>German language ability matters more than most students expect.</strong> Even A2/B1 level German noticeably widens your options, especially outside large multinational employers.</li>
<li><strong>Engineering, IT, and finance graduates generally have the smoothest path to employment</strong>, given ongoing demand in Germany's economy.</li>
<li><strong>Networking during your Masters</strong> &mdash; through internships, Werkstudent (working student) positions, and university career fairs &mdash; matters more than cold applications after graduation.</li>
</ul>
<p>Students who start building their German language skills and professional network during their Masters, not after, consistently have better outcomes than those who wait until graduation to start job hunting.</p>

<h2>A Realistic Checklist Before You Start</h2>
<p>Before you dive into shortlisting universities, make sure you have:</p>
<ul>
<li>Your Bachelor's transcripts and provisional/degree certificate ready for APS</li>
<li>Clarity on whether you're targeting English-taught or German-taught programs</li>
<li>A rough sense of your budget, including the blocked account amount</li>
<li>At least 9&ndash;12 months before your target intake</li>
<li>A plan for who's writing your SOP and LORs, and when</li>
</ul>
<p>Skipping this upfront planning is how applications end up rushed, generic, and ultimately rejected &mdash; not because the student wasn't capable, but because the process wasn't respected.</p>

<h2>Need Help With Your Masters Application?</h2>
<p>We work with students across this entire timeline &mdash; not just the visa paperwork at the end. That means helping you build a realistic university shortlist based on your actual profile (CGPA included), guiding you through the APS process without the usual delays, and writing an SOP that speaks to the specific program instead of reading like a template.</p>
<p>If you're weighing a second Masters, worried about a lower CGPA, or just unsure where to start, <a href="/contact">book a free consultation</a> and we'll give you a straight answer based on your actual profile &mdash; not generic advice. Explore our <a href="/services">full range of services</a> for end-to-end support, from university shortlisting to visa approval.</p>

<h2>Frequently Asked Questions</h2>
<p><strong>How do I apply for a Masters in Germany from India?</strong><br/>Shortlist universities and programs, get your APS certificate, prepare your SOP, LORs, and transcripts, apply directly or through uni-assist, wait for the offer letter, open a blocked account, then apply for your student visa. The full process usually takes 9 to 12 months end to end.</p>
<p><strong>Can a 7 pointer from India get into a Masters program in Germany?</strong><br/>Yes. Most German universities don't have a hard CGPA cutoff the way some other countries do. A 7 pointer with a strong SOP, relevant project work, and good LORs can get into many public universities, especially at technical universities (TUs) that weigh practical experience heavily.</p>
<p><strong>Can I do a second Masters in Germany from India?</strong><br/>Generally yes, as long as the second Masters is in a different field or specialization from your first one, or adds clear academic value. Some universities and some German states restrict funding for a second Masters in the exact same subject, so this needs to be checked program by program.</p>
<p><strong>Do I need engineering background to do Masters in Germany?</strong><br/>No. While engineering graduates have the widest range of Masters options in Germany, there are strong programs for commerce, science, business, and finance backgrounds too. What matters more is that your Bachelor's subject logically connects to the Masters program you're applying for.</p>
<p><strong>Is it easy to get a job in Germany after Masters?</strong><br/>Germany allows international graduates an 18-month post-study work visa to search for a job. Engineering, IT, and finance graduates with German language skills (even A2/B1) have noticeably better job prospects than those relying on English alone.</p>

<!-- ew-seo-footer:start -->
<h2>Related Guides</h2>
<ul>
  <li>{L(HOW_TO_STUDY, 'How to Study in Germany from India &mdash; Step by Step Guide')}</li>
  <li>{L(MASTERS_GUIDE, 'Masters in Germany for Indian Students &mdash; Complete Guide')}</li>
  <li>{L(APS_GUIDE, 'APS Certificate Process for Indian Students')}</li>
  <li>{L(NEW_SLUG_2, 'Study in Germany Without English Language Proficiency')}</li>
</ul>
<!-- ew-seo-footer:end -->
"""

POST1 = dict(
    slug=NEW_SLUG_1,
    title='How to Apply for Masters in Germany from India — Step-by-Step Guide 2026',
    seo_title='Apply for a Masters in Germany from India | EasyWay Germany',
    seo_description='Step-by-step guide for Indian students applying for a Masters in Germany: shortlisting, APS, SOP, visa, plus low CGPA, second masters and jobs after graduation.',
    seo_keywords='how to apply for masters in germany from india, masters in germany from india, how to do masters in germany from india, how to do masters in germany after engineering from india, second masters in germany from india, getting a job in germany from india after masters, masters in finance from germany has demand in india',
    focus_keyword='how to apply for masters in germany from india',
    excerpt='A complete, no-fluff walkthrough of how Indian students apply for a Masters in Germany — from shortlisting universities to landing the admit, plus answers on low CGPA, second masters, and jobs after graduation.',
    category='Study in Germany',
    image_alt='Step-by-step guide to applying for a Masters in Germany from India',
    image_file='How to Apply for a German Master\u2019s.webp',
    public_id='blogs/how-to-apply-for-masters-in-germany-from-india',
)

# ───────────────────────── Post 2: Study in Germany Without English Language Proficiency ─────────────────────────
POST2_CONTENT = f"""<p>Thousands of Indian students assume they need a high IELTS or TOEFL score to study in Germany. That's not true for everyone. Germany actually offers <strong>two separate paths</strong> that don't require you to prove English proficiency at all &mdash; and this guide explains both, so you can pick the one that fits your background.</p>
<p>Whether your English score is weak, you haven't taken IELTS yet, or you simply want to avoid the cost and stress of another English exam, there is very likely a legitimate route for you.</p>

<h2>The Two Routes: English-Taught Without IELTS, or German-Taught Programs</h2>
<p>Before going further, understand this distinction clearly &mdash; it changes everything about your application strategy:</p>
<p><strong>Route 1: English-taught program, but IELTS/TOEFL waived.</strong> You still study in English, but the university accepts an alternative proof instead of a test score.</p>
<p><strong>Route 2: German-taught program.</strong> You study the entire degree in German, which means no English proficiency proof is needed at all &mdash; but you do need to prove German proficiency instead.</p>
<p>Most Indian students applying through EasyWay Germany choose Route 1, because it doesn't require learning a new language from scratch. We'll cover Route 2 as well, for students who already know German or are willing to learn it.</p>

<h2>Route 1: How to Get Into an English-Taught Program Without IELTS</h2>
<h3>Medium of Instruction (MOI) Certificate</h3>
<p>If your Bachelor's degree in India was taught entirely in English &mdash; which is true for most engineering, computer science, business, and science programs &mdash; you can request an <strong>MOI (Medium of Instruction) certificate</strong> from your college. This document states, on official letterhead, that your undergraduate education was conducted in English.</p>
<p>Many German universities accept this MOI certificate as a full substitute for IELTS or TOEFL. This is the single most common way our students skip the English test entirely. Our guide on {L(SOP_APS_GUIDE, 'Masters in Germany without IELTS')} breaks down exactly which alternatives universities accept.</p>
<p><strong>How to get your MOI certificate:</strong></p>
<ol>
<li>Visit your college's examination or registrar's office</li>
<li>Request an MOI certificate stating the medium of instruction for your degree program</li>
<li>Get it signed and stamped by the Head of Department or Registrar</li>
<li>Some universities require it to be in a specific format &mdash; check the target university's admission page first</li>
</ol>

<h3>Duolingo English Test</h3>
<p>An increasing number of German universities &mdash; especially for Master's admissions &mdash; now accept the <strong>Duolingo English Test</strong> as an alternative to IELTS/TOEFL. It's cheaper (around $59), can be taken from home, and results arrive within 48 hours.</p>
<p>This is a strong backup option if your college does not issue MOI certificates, or if the specific university you're applying to does not accept MOI.</p>

<h3>TOEFL as a Lower-Barrier Alternative</h3>
<p>If a university insists on a test score but you want an easier option than IELTS, TOEFL iBT is accepted at nearly every German university and some students find it more approachable, particularly the reading and listening sections.</p>

<h3>One Important Caveat</h3>
<p>Acceptance of MOI certificates, Duolingo, or any alternative varies <strong>university by university and program by program</strong>. Never assume &mdash; always check the specific program's official requirements page, or have a consultant verify it before you apply. A rejected application over a missed language requirement wastes months.</p>

<h2>Route 2: Study Entirely in German (No English Proof Needed)</h2>
<p>Germany has thousands of Bachelor's and Master's programs taught completely in German &mdash; these require zero English proficiency, but they do require you to prove German language ability, typically at B2 or C1 level (CEFR scale), through exams like:</p>
<ul>
<li><strong>TestDaF</strong> (Test Deutsch als Fremdsprache)</li>
<li><strong>DSH</strong> (Deutsche Sprachpr&uuml;fung f&uuml;r den Hochschulzugang)</li>
<li><strong>Goethe-Zertifikat C1</strong></li>
</ul>
<p>This route makes sense if:</p>
<ul>
<li>You already speak German, or are motivated to reach B2/C1 within 12&ndash;18 months</li>
<li>You want access to the widest range of programs (German-taught options vastly outnumber English-taught ones)</li>
<li>You plan to stay and work in Germany long-term &mdash; German fluency dramatically improves job prospects. Read more in our guide on {L(IS_GERMAN_MANDATORY, 'whether German is mandatory for studying in Germany')}.</li>
</ul>
<p><strong>Trade-off:</strong> You'll need 6&ndash;18 months of intensive German study before applying, depending on your starting level. This is a longer path but opens many more university and program options, including at universities that only teach in German.</p>

<h2>Which Route Should You Choose?</h2>
<table>
<thead><tr><th>Your Situation</th><th>Recommended Route</th></tr></thead>
<tbody>
<tr><td>English-medium Bachelor's degree, want to start soon</td><td>Route 1 &mdash; MOI certificate</td></tr>
<tr><td>No English-medium background, weak English test scores</td><td>Route 1 &mdash; Duolingo English Test</td></tr>
<tr><td>Already know German (B2+)</td><td>Route 2 &mdash; German-taught program</td></tr>
<tr><td>Willing to invest 6&ndash;18 months learning German</td><td>Route 2 &mdash; German-taught program</td></tr>
<tr><td>Want the widest possible choice of universities</td><td>Route 2 &mdash; German-taught program</td></tr>
<tr><td>Want to start application within 2&ndash;3 months</td><td>Route 1</td></tr>
</tbody>
</table>

<h2>Common Mistakes Students Make</h2>
<ol>
<li><strong>Assuming MOI is universally accepted.</strong> It isn't &mdash; some universities insist on IELTS regardless of your MOI certificate.</li>
<li><strong>Applying to German-taught programs without starting German lessons early enough.</strong> B2/C1 level typically takes 12+ months from zero.</li>
<li><strong>Not checking program-specific requirements before applying.</strong> Admission requirements differ even between departments at the same university.</li>
<li><strong>Skipping English entirely and assuming German alone is &ldquo;easier.&rdquo;</strong> German-taught admission requirements are often stricter academically, since there's less competition from international pools but higher expectations on language certification.</li>
</ol>

<h2>Need Help Choosing Your Route?</h2>
<p>We check your profile against actual university admission pages &mdash; not general assumptions &mdash; to tell you exactly which path and which universities will accept your current documents without an unnecessary English test. For students going the German-taught route, we also guide you toward the right language school and timeline so you don't delay your intake by a full semester.</p>
<p><a href="/contact">Book a free consultation</a> and we'll map out your fastest route to Germany based on your current English and German proficiency. Explore our <a href="/services">full range of services</a> &mdash; from university shortlisting to SOP writing, APS certificate guidance, and visa support.</p>

<h2>Frequently Asked Questions</h2>
<p><strong>Can I study in Germany without knowing English?</strong><br/>Yes. You have two routes: enroll in a German-taught program (requires German B2/C1), or join an English-taught program where many universities waive IELTS/TOEFL if your previous degree was taught in English, accepting a Medium of Instruction (MOI) certificate instead.</p>
<p><strong>Do German universities accept MOI certificate instead of IELTS?</strong><br/>Many German universities accept a Medium of Instruction (MOI) certificate from your Indian college confirming your Bachelor's was taught fully in English, in place of IELTS or TOEFL. Acceptance varies by university and program, so it must be confirmed on each program's official admission page.</p>
<p><strong>Is Duolingo English Test accepted by German universities?</strong><br/>A growing number of German universities accept the Duolingo English Test as an alternative to IELTS/TOEFL, especially for Master's programs. Confirm acceptance directly on each university's admissions requirements page before relying on it.</p>
<p><strong>Can I study in Germany if I only speak German and not English?</strong><br/>Yes. Germany offers thousands of degree programs taught entirely in German. These require a German language certificate (usually B2 or C1 level, such as TestDaF or DSH) instead of any English proficiency proof.</p>

<!-- ew-seo-footer:start -->
<h2>Related Guides</h2>
<ul>
  <li>{L(SOP_APS_GUIDE, 'Masters in Germany Without IELTS &mdash; Updated 2026 Guide')}</li>
  <li>{L(IS_GERMAN_MANDATORY, 'Is German Mandatory for Studying in Germany?')}</li>
  <li>{L(SURVIVE_NO_GERMAN, 'Can You Survive in Germany Without Speaking German?')}</li>
  <li>{L(NEW_SLUG_1, 'How to Apply for a Masters in Germany from India')}</li>
</ul>
<!-- ew-seo-footer:end -->
"""

POST2 = dict(
    slug=NEW_SLUG_2,
    title='Study in Germany Without English Language Proficiency — Full Guide 2026',
    seo_title='Study in Germany Without English | EasyWay Germany',
    seo_description='Study in Germany without IELTS or TOEFL: how Indian students use MOI certificates, Duolingo, or German-taught programs to get admission. 2026 guide.',
    seo_keywords='study in germany without english language, study in germany without ielts, masters in germany without ielts, study in germany without toefl, german universities without english proficiency',
    focus_keyword='study in germany without english language',
    excerpt='Can you study in Germany without IELTS, TOEFL, or proof of English? Yes — here\u2019s how Indian students get admission using MOI certificates, Duolingo, and German-taught programs.',
    category='Study in Germany',
    image_alt='Study in Germany without English language proficiency — MOI, Duolingo and German-taught programs',
    image_file='Study in Germany Without English.webp',
    public_id='blogs/study-in-germany-without-english-language',
)


def word_count(html):
    return len(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html)).split())


def read_time(words):
    return f'{max(1, round(words / 200))} min read'


def validate_links(content, label):
    for href in re.findall(r'href="(/[^"#?]*)"', content):
        if href.startswith('/blog/'):
            slug = href[len('/blog/'):]
            assert slug in BY_SLUG or slug in (NEW_SLUG_1, NEW_SLUG_2), f'{label}: dead link {href}'
        elif href not in ('/services', '/contact'):
            raise AssertionError(f'{label}: unexpected internal link {href}')


_TRIGGER_PREFIXES = ('what', 'how', 'is ', 'can ', 'do ', 'which')


def simulate_faq_extraction(html, label):
    """Mirrors BlogDetail.jsx's extractFaqSchema() in Python, so a content change can never silently
    break the page's FAQPage schema again (see the 2026-10-28 bug: an <h3> reading "What You Should
    NOT Assume" started with "what", so React's h3-branch fired on it and the real
    "<p><strong>Q?</strong>...A</p>" questions lower down were never reached — items.length==0 is the
    switch between the two branches, and it only takes one stray non-question h3 to flip it)."""
    h3_hits = []
    for h3 in re.findall(r'<h3>(.*?)</h3>', html, re.S):
        text = re.sub(r'<[^>]+>', '', h3).strip()
        low = text.lower()
        if text.endswith('?') or low.startswith(_TRIGGER_PREFIXES):
            h3_hits.append(text)
    if h3_hits:
        raise AssertionError(
            f'{label}: {len(h3_hits)} <h3> heading(s) look like FAQ questions to the live auto-extractor '
            f'{h3_hits!r} — this SUPPRESSES the real "<p><strong>Q?</strong>..." FAQ section entirely '
            f'(the extractor only falls back to it when zero <h3> questions are found). Reword the heading(s).'
        )
    # Real FAQ pairs: a lone <p><strong>...?</strong>...</p> with non-empty trailing text in the SAME
    # <p> (h3 branch empty, so this is the branch that runs). A question-shaped <strong> with nothing
    # after it in that <p> — e.g. a CTA heading like "<p><strong>Need Help?</strong></p>" followed by
    # the real text in a SEPARATE <p> — does NOT count: BlogDetail.jsx computes
    # `fullText.replace(q, '').trim()` and skips the item when that comes back empty.
    items = []
    for q, rest in re.findall(r'<p><strong>([^<]*\?)</strong>(.*?)</p>', html, re.S):
        if re.sub(r'<[^>]+>', '', rest).strip():
            items.append(q)
    return items


for post in (POST1, POST2):
    assert len(post['seo_title']) <= 60, (post['slug'], 'seo_title too long')
    # BlogDetail.jsx only appends " | EasyWay Germany" when this exact substring is absent — a
    # shortened brand (e.g. just "EasyWay") would get BOTH suffixes appended, as verified live.
    assert 'EasyWay Germany' in post['seo_title'], (post['slug'], 'seo_title must contain the literal "EasyWay Germany" or BlogDetail will double-append it')
    assert len(post['seo_description']) <= 160, (post['slug'], 'seo_description too long')
    assert post['slug'] not in BY_SLUG, f"slug already exists: {post['slug']}"
    validate_links(post['content'] if 'content' in post else '', post['slug'])

validate_links(POST1_CONTENT, NEW_SLUG_1)
validate_links(POST2_CONTENT, NEW_SLUG_2)
for c, label, expected_faqs in ((POST1_CONTENT, 'post1', 5), (POST2_CONTENT, 'post2', 4)):
    assert c.count('<h2>Frequently Asked Questions</h2>') == 1, label
    assert c.count('ew-seo-footer:start') == 1, label
    assert '<script' not in c, f'{label}: no literal schema script — rely on the auto-extractor'
    found = simulate_faq_extraction(c, label)
    assert len(found) == expected_faqs, f'{label}: live auto-extractor would find {len(found)} FAQ item(s), expected {expected_faqs}: {found!r}'

print(f"Post 1 ({NEW_SLUG_1}): {word_count(POST1_CONTENT)} words, {read_time(word_count(POST1_CONTENT))}")
print(f"Post 2 ({NEW_SLUG_2}): {word_count(POST2_CONTENT)} words, {read_time(word_count(POST2_CONTENT))}")

# ───────────────────────── Change set for blog 36 (blocked account) ─────────────────────────
NEW_H2_BLOCK = f"""<h2>Masters in Germany Without a Blocked Account &mdash; Is It Possible?</h2><p>If you're specifically applying for a <strong>Master's degree</strong> in Germany, the blocked account requirement works the same way as for any other student visa &mdash; it isn't tied to your degree level. However, Master's applicants have a few additional routes worth knowing about:</p><ul><li><strong>University-specific scholarships</strong> &mdash; Many German universities offer partial or full scholarships specifically for Master's students, which can replace the blocked account requirement entirely if the scholarship covers full living costs and is confirmed in writing.</li><li><strong>DAAD scholarship holders</strong> &mdash; If you receive a DAAD scholarship for your Master's program, you are exempt from the blocked account requirement. The scholarship confirmation letter replaces it.</li><li><strong>Employer or family sponsorship (Verpflichtungserkl&auml;rung)</strong> &mdash; Covered in detail below; this applies equally to Master's and Bachelor's applicants.</li></ul><p>For most self-funded Master's applicants without a scholarship, the blocked account remains the standard and safest route. Treat the alternatives below as exceptions, not the default plan &mdash; don't delay your visa application waiting on a scholarship decision.</p><p>Need help with your Masters application end-to-end? {L('services', 'See our full services')} &mdash; from university shortlisting to blocked account setup.</p>"""

NEW_FAQ_PAIRS = ('<p><strong>Can I do a Masters in Germany without a blocked account?</strong>'
                  'Only if you have an alternative recognised by the embassy &mdash; such as a full DAAD scholarship, '
                  'a university scholarship covering full living costs, or a Verpflichtungserkl&auml;rung (formal sponsorship) '
                  'from a German resident. Without one of these, the blocked account is required for Masters students the '
                  'same as any other student visa applicant.</p>'
                  '<p><strong>Does a DAAD scholarship replace the blocked account for Masters students?</strong>'
                  'Yes. If you hold a confirmed DAAD scholarship covering your living expenses, you are exempt from opening '
                  'a blocked account. Your scholarship award letter serves as financial proof instead.</p>')

BLOG36_SEO_DESCRIPTION = 'Can Indian Masters students get a Germany visa without a blocked account? DAAD, scholarships, sponsors and other legal alternatives. Updated 2026.'
BLOG36_SEO_KEYWORDS_ADD = 'masters in germany without blocked account'


def apply_blog36_changes(content):
    c = content
    assert c.count(NEW_H2_BLOCK) == 0, 'blog 36 already has the new section (already applied)'

    anchor = '<h2>4. Alternative 1 \u2014 Scholarship Letter</h2>'
    assert c.count(anchor) == 1, 'blog 36: Alternative 1 heading not found'
    c = c.replace(anchor, NEW_H2_BLOCK + anchor)

    faq_anchor = ('No. Indian bank statements alone are <strong>not accepted</strong> as proof of funds for a '
                  'German student visa.</p>')
    assert c.count(faq_anchor) == 1, 'blog 36: last FAQ paragraph not found'
    c = c.replace(faq_anchor, faq_anchor + NEW_FAQ_PAIRS)

    # Pre-existing bug fix: drop the stale/duplicate FAQPage <script>; BlogDetail.jsx already
    # auto-generates an up-to-date one from the visible "<p><strong>Q?</strong>..." pairs above.
    stale = re.search(r'<script type="application/ld\+json">\s*\{\s*"@context".*?"@type":\s*"FAQPage".*?</script>\s*', c, re.S)
    assert stale, 'blog 36: stale FAQPage script not found'
    c = c[:stale.start()] + c[stale.end():]
    return c


# ───────────────────────── Change set for blog 29 (masters without IELTS): reciprocal link + same schema fix ─────────────────────────
def apply_blog29_changes(content):
    c = content
    anchor = '<li><a href="/blog/what-ielts-score-do-you-need-for-a-master-s-in-germany-complete-guide">What IELTS Score Do You Need for a Master\u2019s in Germany? Complete Guide</a></li>'
    assert c.count(anchor) == 1, 'blog 29: related-guides anchor not found'
    new_li = f'\n  <li>{L(NEW_SLUG_2, "Study in Germany Without English Language Proficiency")}</li>'
    assert new_li not in c, 'blog 29 already links the new post'
    c = c.replace(anchor, anchor + new_li)

    stale = re.search(r'<script type="application/ld\+json">\s*\{\s*"@context".*?"@type":\s*"FAQPage".*?</script>\s*', c, re.S)
    assert stale, 'blog 29: stale FAQPage script not found'
    c = c[:stale.start()] + c[stale.end():]
    return c


blog36_old = sb('GET', 'blogs?select=*&id=eq.36')[0]
blog29_old = sb('GET', 'blogs?select=*&id=eq.29')[0]
blog36_new_content = apply_blog36_changes(blog36_old['content'])
blog29_new_content = apply_blog29_changes(blog29_old['content'])
print(f"\nBlog 36: {word_count(blog36_old['content'])} -> {word_count(blog36_new_content)} words "
      f"({blog36_old['content'].count('FAQPage')} -> {blog36_new_content.count('FAQPage')} FAQPage script blocks left in content)")
print(f"Blog 29: {word_count(blog29_old['content'])} -> {word_count(blog29_new_content)} words "
      f"({blog29_old['content'].count('FAQPage')} -> {blog29_new_content.count('FAQPage')} FAQPage script blocks left in content)")

for content, label, expected_faqs in ((blog36_new_content, 'blog36', 8), (blog29_new_content, 'blog29', 4)):
    found = simulate_faq_extraction(content, label)
    assert len(found) == expected_faqs, f'{label}: live auto-extractor would find {len(found)} FAQ item(s), expected {expected_faqs}: {found!r}'

if not APPLY:
    print('\nDRY RUN — nothing uploaded or written. Re-run with --apply.')
    sys.exit(0)

# ───────────────────────── backups ─────────────────────────
os.makedirs(os.path.join(ROOT, 'supabase/backups'), exist_ok=True)
bk_path = os.path.join(ROOT, 'supabase/backups/blogs-29-36-before-oct28-content-drop.json')
if not os.path.exists(bk_path):
    json.dump([blog29_old, blog36_old], open(bk_path, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print('backed up blogs 29 and 36 ->', bk_path)

# ───────────────────────── Cloudinary uploads ─────────────────────────
for post in (POST1, POST2):
    path = os.path.join(ROOT, post['image_file'])
    assert os.path.exists(path), 'missing image: ' + post['image_file']
    res = cl_upload(path, post['public_id'])
    post['image'] = res['secure_url']
    post['og_image'] = og_url(post['public_id'])
    with urllib.request.urlopen(post['image'], timeout=60) as r:
        assert r.status == 200
    print('uploaded', post['slug'], '->', post['image'])

# ───────────────────────── insert the 2 new posts ─────────────────────────
TODAY = '2026-10-28'
content_map = {NEW_SLUG_1: POST1_CONTENT, NEW_SLUG_2: POST2_CONTENT}
for post in (POST1, POST2):
    row = {
        'slug': post['slug'], 'title': post['title'], 'content': content_map[post['slug']],
        'excerpt': post['excerpt'], 'category': post['category'], 'date': TODAY,
        'read_time': read_time(word_count(content_map[post['slug']])),
        'is_published': True, 'image': post['image'], 'image_alt': post['image_alt'],
        'og_image': post['og_image'], 'seo_title': post['seo_title'],
        'seo_description': post['seo_description'], 'seo_keywords': post['seo_keywords'],
        'focus_keyword': post['focus_keyword'],
    }
    sb('POST', 'blogs', row)
    print('inserted', post['slug'])

# ───────────────────────── blog 36: new section + FAQs + meta, minus the stale schema ─────────────────────────
new_keywords = blog36_old['seo_keywords']
if BLOG36_SEO_KEYWORDS_ADD not in new_keywords:
    new_keywords = new_keywords.rstrip(', ') + ', ' + BLOG36_SEO_KEYWORDS_ADD
sb('PATCH', 'blogs?id=eq.36', {
    'content': blog36_new_content,
    'seo_description': BLOG36_SEO_DESCRIPTION,
    'seo_keywords': new_keywords,
})
print('updated blog 36')

# ───────────────────────── blog 29: reciprocal related-guide link, minus the stale schema ─────────────────────────
sb('PATCH', 'blogs?id=eq.29', {'content': blog29_new_content})
print('updated blog 29')

print('\ndone')
