# MockChat: Expo React Native + Firebase Guide

Last updated: May 4, 2026.

MockChat is a small WhatsApp-style learning app built with Expo, React Native, Expo Router, JavaScript, NativeWind/Tailwind-style classes, Firebase Auth, Cloud Firestore, Cloud Storage, and Cloud Functions.

This README is the single canonical document for the project. It explains how the app works, how the data is saved, how navigation works, how Firebase connects to the frontend, and what was removed after the demo for safety.

## Current Safety State

The public Firebase Hosting deploy wiring has been removed from the repo so this codebase cannot accidentally redeploy a public site.

Removed from code:

```text
package.json:
  export:web script
  deploy:hosting script

firebase.json:
  hosting.public
  hosting.rewrites
  hosting.cache headers
```

Still present for learning/backend structure:

```text
firestore.rules
firestore.indexes.json
storage.rules
functions/
Firebase client code
```

Local secrets and project-specific deploy state are not meant to be committed:

```text
.env.local
.firebase/
dist/
node_modules/
.firebaserc
```

Important: removing Hosting from the repo stops accidental future deploys. To take the already-live Firebase Hosting site offline, disable Hosting in the Firebase Console or run `firebase hosting:disable` intentionally against the project. That is a cloud-side destructive action, so do it only when you mean it.

## Demo Talk Track

This is the short version to say out loud.

```text
This is an Expo React Native chat app with one codebase for web, iOS, and Android.
Expo Router gives it file-based navigation: app/(auth) is sign-in/sign-up, app/(app) is the signed-in area, and app/(app)/chat/[chatId].js is a dynamic chat route.

The frontend screens do not talk to Firebase directly.
Screen -> hook -> Firebase service -> Firebase SDK -> Firebase backend.
That keeps the UI readable and keeps backend logic in src/firebase.

Firebase Auth stores identity.
When a user signs up, Firebase Auth creates the account, then the app writes a users/{uid} profile document in Firestore.
That profile document is what lets other signed-in users appear in New chat.

Firestore stores the chat data.
chats/{chatId} stores the conversation summary and memberIds.
chats/{chatId}/messages/{messageId} stores each message.
Because messages are saved as documents in Firestore, chat history survives refreshes, sign-out, reinstall, and logging in from another device.

Direct chat ids are deterministic.
The app sorts the two user ids and builds one stable id, so the same two people always reopen the same conversation instead of creating duplicates.

Media is split correctly.
Photos/videos are uploaded to Cloud Storage as files.
Firestore stores only the attachment metadata: type, storagePath, downloadURL, size, dimensions, and who uploaded it.
Messages link to attachments through attachmentIds and a small attachment summary.

Realtime behavior comes from Firestore listeners.
The message screen subscribes to chats/{chatId}/messages ordered by createdAt, so when a message is written, both users see the thread update.

Navigation is Expo Router.
The chat screen route is /chat/{chatId}.
The Chats button links back to /, which is the main chat list.
The short Chat code shown in the header is only a compact label from the document id.

iOS/Android use email-password sign-in for the demo.
The Google button is hidden on native because web Google sign-in and native Google sign-in are different flows.
On web, Firebase can use GoogleAuthProvider + signInWithPopup because the browser owns the popup/redirect.
On iOS/Android, the emulator is a native app, so Google OAuth needs native client IDs, redirect URI scheme configuration, and an Expo AuthSession or native Google sign-in setup.
For this demo, email-password is the complete native path.
```

## Run The App

Install dependencies:

```bash
npm install
```

Run web locally:

```bash
npm run web
```

Run iOS simulator:

```bash
npm run ios
```

Run Android emulator:

```bash
npm run android
```

`npm run web`, `npm run ios`, and `npm run android` are local development/demo commands. They do not publish the app publicly.

## Project Setup From Zero

Create the app:

```bash
npx create-expo-app@latest mock-chat-app
cd mock-chat-app
```

Use JavaScript route files for this app:

```text
app/_layout.js
app/(auth)/_layout.js
app/(auth)/sign-in.js
app/(auth)/sign-up.js
app/(app)/_layout.js
app/(app)/index.js
app/(app)/new-chat.js
app/(app)/profile.js
app/(app)/chat/[chatId].js
```

Install Firebase and native helpers:

```bash
npx expo install firebase
npx expo install @react-native-async-storage/async-storage
npx expo install expo-image-picker expo-image-manipulator expo-file-system expo-network
```

Install NativeWind/Tailwind styling:

```bash
npm install nativewind react-native-reanimated react-native-safe-area-context
npm install --save-dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 babel-preset-expo
npx tailwindcss init
```

The app uses JavaScript, not TypeScript, for the app screens and services. A `tsconfig.json` can still exist because Expo and NativeWind tooling may use it.

The unused Expo starter TypeScript sample folders were removed so there is only one real component/hook/constants structure:

```text
src/components/
src/hooks/
src/constants/
```

## Architecture

The app follows this shape:

```text
Screen
  -> hook
    -> Firebase service
      -> Firebase SDK
        -> Firebase backend
```

Why:

```text
Screens:
  layout, buttons, inputs, navigation, loading/error UI

Hooks:
  React state around subscriptions and actions

Firebase service files:
  actual Firebase SDK calls

Firebase backend:
  Auth, Firestore, Storage, Functions, rules
```

This keeps screens readable. A screen says "send message" or "open chat"; the service file knows how that maps to Firestore.

## File Map

```text
app/
  _layout.js
    root provider and navigation mount

  (auth)/
    _layout.js
      redirects signed-in users away from auth screens

    sign-in.js
      email/password sign-in, web-only Google button

    sign-up.js
      creates Auth user and Firestore profile

  (app)/
    _layout.js
      redirects signed-out users to sign-in

    index.js
      chat list

    new-chat.js
      user discovery and direct chat creation

    profile.js
      account display and sign out

    chat/[chatId].js
      dynamic chat route, messages, media send, back to Chats

src/components/
  reusable UI: Button, TextField, Avatar, ChatListItem, MessageBubble, EmptyState, Screen

src/context/AuthContext.js
  app-wide auth state and sign-out flow

src/hooks/
  useAuthUser, useUsers, useChats, useMessages, useNetworkStatus

src/firebase/
  env.js
    reads EXPO_PUBLIC Firebase config from environment variables

  config.js
    native Firebase app/Auth/Firestore/Storage setup

  config.web.js
    web Firebase app/Auth/Firestore/Storage setup

  auth.js
    sign-up, sign-in, web Google sign-in, sign-out, auth listener

  profiles.js
    creates users/{uid}

  firestore.js
    users/chats/messages subscriptions and writes

  media.js
    image/video picker, compression, Storage upload

  status.js
    safe user-facing error formatting

src/cache/clearLocalPrivateCache.js
  sign-out cleanup hook for future local private cache

firestore.rules
  Firestore security rules

storage.rules
  Cloud Storage security rules

functions/
  optional callable backend scaffold
```

## Where To Change Things

```text
New page:
  add a file under app/

Screen layout:
  edit the matching route file in app/

Reusable visual piece:
  add or edit src/components/

Shared app state:
  use src/context/ or src/hooks/

Firebase read/write:
  edit src/firebase/

Collection/path names:
  edit src/constants/firebasePaths.js

Security:
  edit firestore.rules or storage.rules

CLI/build behavior:
  edit package.json scripts and firebase.json
```

## Expo Router And React Native Basics

Expo Router maps files to routes:

```text
app/(app)/index.js
  /

app/(app)/new-chat.js
  /new-chat

app/(app)/chat/[chatId].js
  /chat/someChatId
```

`_layout.js` wraps a folder of routes. It is where shared navigation settings, providers, and route guards live.

Route groups like `(auth)` and `(app)` organize files but do not appear in the URL.

`Stack` is the mobile navigation container. It gives screens the normal push/pop behavior users expect: open a chat, see a header, press back, return to the chat list.

`Stack.Screen` registers or configures one route inside that stack. The `name` matches the file or folder:

```text
<Stack.Screen name="index" />
  app/(app)/index.js

<Stack.Screen name="chat/[chatId]" />
  app/(app)/chat/[chatId].js
```

The app uses route guards in layout files:

```text
app/(auth)/_layout.js
  if signed in, redirect to /

app/(app)/_layout.js
  if signed out, redirect to /sign-in
```

Navigation from code uses Expo Router:

```text
router.push("/new-chat")
router.push(`/chat/${chatId}`)
router.back()
```

React Native uses native primitives instead of HTML:

```text
View      instead of div
Text      instead of p/span
TextInput instead of input
Pressable instead of button
```

NativeWind lets us use Tailwind-style `className` on React Native components.

Components are normal React functions that return React Native UI:

```text
src/components/Button.js
  one button style reused across screens

src/components/MessageBubble.js
  one message renderer for text/media bubbles
```

Constants are shared names that should not be repeated everywhere:

```text
src/constants/firebasePaths.js
  users, chats, messages, attachments
```

Scripts in `package.json` are shortcuts for commands you run often:

```text
npm run web
  starts Expo for browser development

npm run ios
  starts Expo and opens the iOS simulator

npm run android
  starts Expo and opens the Android emulator

npm run lint
  checks code style and obvious React/JS issues
```

## Firebase Config And Secrets

The app reads config from `.env.local`:

```text
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Expo only inlines static dot access:

```js
process.env.EXPO_PUBLIC_FIREBASE_API_KEY
```

Do not treat `EXPO_PUBLIC_*` as private secrets. They are client config values and can appear in the built app. Security comes from Firebase Auth, Firestore rules, Storage rules, App Check, and backend checks, not from hiding these values.

`.env.local` is ignored by git.

## Data Model

Firestore is schemaless, but the app still uses a planned document shape.

### `users/{uid}`

```text
uid: string
displayName: string
email: string
photoURL: string | null
createdAt: timestamp
updatedAt: timestamp
```

Purpose:

```text
Auth proves who the user is.
users/{uid} stores app profile data that other users can discover.
```

### `chats/{chatId}`

```text
type: "direct"
memberIds: [uidA, uidB]
memberSummary:
  uidA:
    displayName: string
    photoURL: string | null
  uidB:
    displayName: string
    photoURL: string | null
createdBy: uid
createdAt: timestamp
updatedAt: timestamp
lastMessageText: string
lastMessageAt: timestamp | null
lastMessageSenderId: uid | ""
```

Purpose:

```text
The chat document is the conversation header.
memberIds powers "which chats belong to me?"
lastMessageText powers the chat list preview.
```

Direct chat ids are deterministic:

```text
dm_${sortedUidA}_${sortedUidB}
```

That prevents duplicate one-to-one chats.

### `chats/{chatId}/messages/{messageId}`

Text message:

```text
type: "text"
text: string
senderId: uid
createdAt: timestamp
clientCreatedAt: ISO string
attachmentIds: []
deletedForEveryone: false
```

Media message:

```text
type: "media"
text: caption string
senderId: uid
createdAt: timestamp
clientCreatedAt: ISO string
attachmentIds: [attachmentId]
attachments: [small attachment summary]
deletedForEveryone: false
```

Purpose:

```text
Every message is a Firestore document.
That is why history survives refresh, reinstall, and multi-device login.
```

### `chats/{chatId}/attachments/{attachmentId}`

```text
type: "image" | "video"
storagePath: "chats/{chatId}/attachments/{attachmentId}/original.jpg"
downloadURL: string
contentType: string
sizeBytes: number
width: number | null
height: number | null
durationMillis: number | null
uploadedBy: uid
messageId: messageId
createdAt: timestamp
```

Purpose:

```text
Firestore stores metadata.
Cloud Storage stores file bytes.
```

## Feature Flows

### Sign Up

```text
User enters name/email/password
  -> signUpWithEmail()
  -> Firebase Auth creates account
  -> updateProfile sets displayName
  -> createUserProfile writes users/{uid}
  -> AuthContext sees the signed-in user
  -> route guard sends user to chat list
```

### Sign In

```text
User enters email/password
  -> signInWithEmail()
  -> Firebase Auth signs in
  -> AuthContext receives current user
  -> route guard shows signed-in screens
```

Native iOS/Android uses email-password in this demo. Web Google sign-in uses browser popup logic. Native Google sign-in is hidden because it needs native OAuth clients, redirect URI scheme setup, and AuthSession/native Google wiring.

### User Discovery

```text
New chat screen
  -> useUsers()
  -> subscribeToUsers()
  -> Firestore users ordered by displayName
  -> filter out current user
  -> render people list
```

For the demo, every signed-in user can see every other user.

### Open Or Create Direct Chat

```text
Tap Chat on a user
  -> createOrOpenDirectChat(currentUser, otherUser)
  -> build deterministic chat id from sorted uids
  -> getDoc(chats/{chatId})
  -> create chat if missing
  -> router.push(/chat/{chatId})
```

Important rules detail:

```text
getDoc needs read permission even when the doc does not exist.
The rules allow signed-in users to check a missing chat id.
Existing chats remain readable only to members.
```

### Send Text Message

```text
Type message
  -> useMessages.sendMessage()
  -> sendTextMessage()
  -> Firestore batch:
       create message document
       update chat last-message summary
  -> onSnapshot listener updates UI
```

A batch keeps the message and chat preview update together.

### Send Media Message

```text
Tap Media
  -> pickChatMediaFromLibrary()
  -> request media library permission
  -> pick image/video
  -> compress image if needed
  -> uploadChatMedia()
  -> upload bytes to Cloud Storage
  -> get download URL
  -> sendMediaMessage()
  -> Firestore batch:
       create attachment metadata
       create media message
       update chat last-message summary
```

Images/videos are not stored directly in Firestore.

### Realtime Message History

```text
useMessages(chatId)
  -> subscribeToMessages()
  -> onSnapshot(chats/{chatId}/messages ordered by createdAt)
  -> setMessages()
  -> MessageBubble renders each message
```

`onSnapshot` keeps the UI live. No manual refresh is needed.

### Sign Out

```text
Profile screen Sign out
  -> signOutAndClearCache()
  -> clearLocalPrivateCache()
  -> Firebase Auth signOut()
  -> route guard sends user back to sign-in
```

There is no custom SQLite cache in this version. Firestore is the source of truth for messages and metadata.

### Offline Behavior

```text
Expo Network checks whether the device appears offline.
If offline, the app allows reading already-loaded screen state but blocks new sends/uploads.
On reconnect, Firestore listeners can receive new server data again.
```

## Security Rules

The rules enforce the demo scope:

```text
users:
  signed-in users can read profiles
  users can create/update only their own profile

chats:
  signed-in users can create direct chats that include themselves
  members can read/update their chat summary
  members cannot change memberIds

messages:
  chat members can read messages
  senderId must match request.auth.uid
  text messages need non-empty text
  media messages must link to an attachment
  update/delete is disabled

attachments:
  chat members can read/create metadata
  uploadedBy must match request.auth.uid

storage files:
  chat members can read/write files for that chat
  uploads must be image/* or video/*
  uploads must be under 25 MB
```

This is not end-to-end encryption. For a real production chat app, add contacts/invites, blocking/reporting, App Check, rate limits, push notifications, stronger abuse controls, and privacy rules around profile discovery.

## Cloud Functions

`functions/index.js` contains a small callable backend scaffold. It was used to verify that Cloud Functions deploy worked. It is not exposed in the current demo UI, and it should not return private/internal app state.

If backend cleanup is desired, remove deployed Functions in Firebase Console or with Firebase CLI intentionally.

Frontend code should call Cloud Functions only when logic must be trusted server-side, such as sending notifications, moderating content, charging money, or writing data the client should not be allowed to write directly. Simple chat reads/writes stay in Firestore because rules already enforce the demo permissions.

## Hosting Removal

Hosting was used for the class demo. After the demo, Hosting config and deploy scripts were removed from this repo to reduce accidental public exposure.

This repo intentionally has no Hosting config and no Hosting deploy script now. If you intentionally publish it again later, re-add Hosting only for that deploy and remove it again afterward. Do not keep public Hosting enabled casually on a learning project with real Firebase backend access.

## Firebase CLI Commands

Connect local repo to a Firebase project:

```bash
firebase login
firebase use --add
```

Deploy Firestore rules/indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Deploy Storage rules:

```bash
firebase deploy --only storage
```

Deploy Functions:

```bash
firebase deploy --only functions
```

Set Functions artifact cleanup policy:

```bash
firebase functions:artifacts:setpolicy --location us-central1 --days 1 --force
```

## GitHub Push Safety Checklist

Before pushing:

```bash
git status --short
git check-ignore -v .env.local .firebase dist node_modules .firebaserc
rg -n "AI""za|private[-_]?key|client[-_]?secret|refresh[-_]?token" --glob '!node_modules/**' --glob '!dist/**' .
npm run lint
```

Safe to commit:

```text
source code
README.md
firestore.rules
firestore.indexes.json
storage.rules
functions source code
.env.example
package.json
package-lock.json
```

Do not commit:

```text
.env.local
.firebase/
dist/
node_modules/
.firebaserc
```

## Suggested Final Commit Message

```text
chore: make mock chat demo safe and secure
```
