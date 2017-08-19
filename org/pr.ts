import { schedule } from "danger"
const anySchedule = schedule as any // danger/danger-js#344

// Check all markdown documents for spelling issues.
//
import spellcheck from 'danger-plugin-spellcheck'
anySchedule(spellcheck({ settings: "CocoaPods/peril-settings@spellcheck.json" }))
