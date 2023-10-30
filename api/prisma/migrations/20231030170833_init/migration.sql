-- CreateTable
CREATE TABLE "Flashcard" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answers" TEXT[],

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);
