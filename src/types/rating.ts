export interface ClassRating {
    id?: string;
    userId: string;
    userName: string;
    classId: string; // Could be the class schedule ID
    className: string;
    classDate: string; // e.g., "2023-10-24"
    classTime: string; // e.g., "19:00"
    coachName: string;
    ratingGeneral: number; // 1-5
    ratingCoach: number; // 1-5
    ratingEffort: number; // 1-10
    comment?: string; // Optional feedback
    createdAt: number; // Timestamp
}
