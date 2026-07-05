# Social Calendar — Bluesky reference

Reference material for social posts. **Not wired into the site.** Two evergreen,
year-round series, both built on the deterministic engine.

**How this was made (repeat the method to extend it):**
- **Dates** are verified against public sources (Wikipedia / Britannica / History.com / NASA / etc.), never from memory.
- **Bearings** are `mod22(birth month + birth day)`; **cards of the day** are the collective day card for the exact date, both computed with the almanac's own formulas and spot-checked against the live `/today/[date]` and `/birthday/[slug]` pages.
- **Essences** are pulled verbatim from `content/cards/*.json` (`cardReading.essence`) — i.e. Tali's authored card copy, safe to quote as-is.
- The **interpretation** of what a card says about a person or event is authored per post; the data below is the scaffold, not the copy.

---

## 1. Celebrity Bearings

Post each on the person's birthday. Every name links to a live `/birthday/` page.

| Date | Person | Bearing | Receipts | Page |
|---|---|---|---|---|
| Jan 8 | David Bowie | The Hermit | 1+8=9 | /birthday/january-8 |
| Jan 19 | Dolly Parton | Judgement | 1+19=20 | /birthday/january-19 |
| Jan 29 | Oprah Winfrey | Strength | 1+29=30→8 | /birthday/january-29 |
| **Feb 20** | **Rihanna** | **The Fool** ⭐ | 2+20=22→0 | /birthday/february-20 |
| Mar 14 | Albert Einstein | The Star | 3+14=17 | /birthday/march-14 |
| Mar 28 | Lady Gaga | The Hermit | 3+28=31→9 | /birthday/march-28 |
| Apr 4 | Robert Downey Jr. | Strength | 4+4=8 | /birthday/april-4 |
| Apr 15 | Emma Watson | The Sun | 4+15=19 | /birthday/april-15 |
| May 5 | Adele | Wheel of Fortune | 5+5=10 | /birthday/may-5 |
| May 6 | George Clooney | Justice | 5+6=11 | /birthday/may-6 |
| Jun 4 | Angelina Jolie | Wheel of Fortune | 6+4=10 | /birthday/june-4 |
| Jun 7 | Prince | Death | 6+7=13 | /birthday/june-7 |
| Jul 9 | Tom Hanks | The Tower | 7+9=16 | /birthday/july-9 |
| Aug 4 | Barack Obama | The Hanged One | 8+4=12 | /birthday/august-4 |
| Sep 1 | Zendaya | Wheel of Fortune | 9+1=10 | /birthday/september-1 |
| Sep 2 | Keanu Reeves | Justice | 9+2=11 | /birthday/september-2 |
| Sep 4 | Beyoncé | Death | 9+4=13 | /birthday/september-4 |
| Sep 26 | Serena Williams | Death | 9+26=35→13 | /birthday/september-26 |
| Oct 21 | Kim Kardashian | The Hermit | 10+21=31→9 | /birthday/october-21 |
| Oct 24 | Drake | The Hanged One | 10+24=34→12 | /birthday/october-24 |
| **Nov 11** | **Leonardo DiCaprio** | **The Fool** ⭐ | 11+11=22→0 | /birthday/november-11 |
| Nov 22 | Scarlett Johansson | Justice | 11+22=33→11 | /birthday/november-22 |
| Dec 13 | Taylor Swift | The Empress | 12+13=25→3 | /birthday/december-13 |
| Dec 18 | Billie Eilish | Strength | 12+18=30→8 | /birthday/december-18 |

**Hooks:**
- ⭐ **Two Fools** — Rihanna (Feb 20) and Leonardo DiCaprio (Nov 11). The Fool is the rarest Bearing (only a handful of birthdays land on 0). Bookend the year with them.
- **"Same Bearing" pairs:** Beyoncé + Serena (Death); Oprah + Billie Eilish + RDJ (Strength); Bowie + Gaga + Kim K (The Hermit); Keanu + Clooney + Scarlett (Justice); Adele + Jolie + Zendaya (Wheel of Fortune).
- September is the richest cluster (1, 2, 4, 26).

---

## 2. This Day in History

Post on the anniversary. Each shows the day's **Major** (archetype) and the **card of
the day** (collective minor). ⭐ = standout card-event matches. Each links to the live
`/today/[date]` page for that historical date.

### Jan 9, 2007 — Steve Jobs unveils the iPhone ⭐ · `/today/2007-01-09`
- **The Sun** — "gets to be glad, plainly and without apology… the warmth of being seen and not having to hide it."
- **Six of Wands** — "victory and recognition, the win that others witness… success carried home in public view."

### Feb 9, 1964 — The Beatles on Ed Sullivan · `/today/1964-02-09`
- **The Hermit** — "steps back to hear what's true… withdraws in order to listen."
- **Knight of Pentacles** — "steady, reliable action… the unglamorous follow-through that finishes what it starts."

### Feb 11, 1990 — Nelson Mandela freed ⭐ · `/today/1990-02-11`
- **Wheel of Fortune** — "meets change you didn't choose… the turning that lifts and drops without asking permission."
- **Two of Wands** — "potential held in the hand… standing at the edge of your own life looking at what you could build."

### Mar 10, 1876 — Bell's first telephone call · `/today/1876-03-10`
- **Death** — "lets something end so something else can begin… the clean cut that makes room."
- **Nine of Cups** — "the heart that got what it wanted… a wish fulfilled." ("Mr. Watson, come here.")

### Apr 24, 1990 — Hubble telescope launched · `/today/1990-04-24`
- **The Empress** — "makes things grow… the force that nurtures whatever it touches."
- **Seven of Pentacles** — "the pause to assess a long effort, the patient wait for growth."

### May 25, 1977 — Star Wars released · `/today/1977-05-25`
- **Wheel of Fortune** — "cycles, timing, the turning that lifts and drops."
- **King of Wands** — "fire expressed outward as vision and leadership… the charisma that moves the self and others."

### May 29, 1953 — First summit of Everest ⭐ · `/today/1953-05-29`
- **Strength** — "power held quietly… courage that doesn't need to roar."
- **Ten of Wands** — "the weight of everything you took on… the end of the suit's long climb." (The burden at the top.)

### Jun 28, 1969 — Stonewall uprising begins · `/today/1969-06-28`
- **The Devil** — "bound to what you can't stop wanting… shows you what holds you, and dares you to look at it honestly."
- **Page of Pentacles** — "ready to learn a skill, build a foundation, or start the long patient work." (The card of chains, on the night people refused them. Handle with respect.)

### Jul 13, 1985 — Live Aid · `/today/1985-07-13`
- **The World** — "arrives, whole, at the end of something real… the deep yes of a cycle closed well."
- **Knight of Pentacles** — "steady, reliable action… follow-through that finishes what it starts."

### Jul 20, 1969 — Apollo 11, first Moon landing ⭐ · `/today/1969-07-20`
- **Strength** — "power held quietly… courage that doesn't need to roar."
- **Ace of Wands** — "the first flare of want… the moment something in you says yes, this, go." (Marquee post.)

### Aug 1, 1981 — MTV launches · `/today/1981-08-01`
- **The Lovers** — "the meeting of two that asks you to be genuinely known… where connection and choice overlap."
- **Six of Swords** — "the journey away from trouble toward something calmer… finally moving in the right direction."

### Aug 28, 1963 — MLK, "I Have a Dream" ⭐ · `/today/1963-08-28`
- **Justice** — "wants the truth even when it costs something… the willingness to be answerable."
- **Ace of Swords** — "the moment of sudden clarity… the idea that arrives sharp enough to change everything."

### Sep 4, 1998 — Google founded ⭐ · `/today/1998-09-04`
- **The Moon** — "moves through what it cannot fully see… feel your way when the path won't show itself plainly." (Built to find what's hidden.)
- **Page of Cups** — "emotional curiosity… still learning what it can do."

### Oct 23, 2001 — Apple unveils the iPod · `/today/2001-10-23`
- **Temperance** — "blends what doesn't obviously go together… the slow alchemy of making one thing out of many." ("1,000 songs in your pocket.")
- **Ten of Wands** — "the weight of everything you took on… carrying too much."

### Nov 9, 1989 — Berlin Wall falls · `/today/1989-11-09`
- **The Empress** — "makes things grow… gives life room to unfold."
- **Eight of Pentacles** — "dedicated craft, the patient repetition that builds mastery."

### Dec 17, 1903 — Wright brothers' first flight · `/today/1903-12-17`
- **Judgement** — "decides you're allowed to become someone new… and then to let it change you."
- **Two of Wands** — "potential held in the hand… standing at the edge of your own life looking at what you could build."

**Lead with the ⭐ matches** — the moon landing (Ace of Wands) and MLK (Justice + Ace of
Swords) are almost too on-the-nose, which is exactly the "the math just knows" hook that
sells the system.

---

## Sources

**Celebrity birthdays:** Wikipedia entries for each person.
**Historical dates:** Apollo 11 (NASA / Smithsonian), Live Aid (Britannica), MLK speech (Library of Congress), MTV (History.com), Google (History of Google / Wikipedia), iPod & iPhone (Apple newsroom), Berlin Wall (Wikipedia / NATO), Wright brothers (NASM / NPS), Beatles on Ed Sullivan (Wikipedia / The Beatles Bible), Mandela (History.com / Nelson Mandela Foundation), Bell (Science Museum / History.com), Hubble (NASA), Everest (History.com / Britannica), Star Wars (Wikipedia / Britannica), Stonewall (Library of Congress / Britannica).
