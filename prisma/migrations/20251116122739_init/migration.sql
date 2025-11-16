-- CreateTable
CREATE TABLE "ReviewConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompanyQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reviewConfigId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CompanyQuestion_reviewConfigId_fkey" FOREIGN KEY ("reviewConfigId") REFERENCES "ReviewConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupportingQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyQuestionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "responderType" TEXT NOT NULL DEFAULT 'MANAGER',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SupportingQuestion_companyQuestionId_fkey" FOREIGN KEY ("companyQuestionId") REFERENCES "CompanyQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyQuestionId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyAnswer" TEXT,
    CONSTRAINT "ReviewSession_companyQuestionId_fkey" FOREIGN KEY ("companyQuestionId") REFERENCES "CompanyQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupportingAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reviewSessionId" INTEGER NOT NULL,
    "supportingQuestionId" INTEGER NOT NULL,
    "answer" TEXT,
    CONSTRAINT "SupportingAnswer_reviewSessionId_fkey" FOREIGN KEY ("reviewSessionId") REFERENCES "ReviewSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SupportingAnswer_supportingQuestionId_fkey" FOREIGN KEY ("supportingQuestionId") REFERENCES "SupportingQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportingAnswer_reviewSessionId_supportingQuestionId_key" ON "SupportingAnswer"("reviewSessionId", "supportingQuestionId");
