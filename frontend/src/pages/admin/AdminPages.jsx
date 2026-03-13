import AdminCrudPage from './AdminCrudPage';

export const AdminUsers = () => (
    <AdminCrudPage
        endpoint="users"
        title="Manage Users"
        columns={[
            { key: 'name', label: 'Name', required: true },
            { key: 'email', label: 'Email', required: true },
            { key: 'role', label: 'Role', required: true },
            { key: 'avatar', label: 'Avatar' }
        ]}
    />
);

export const AdminCourses = () => (
    <AdminCrudPage
        endpoint="courses"
        title="Manage Courses"
        columns={[
            { key: 'title', label: 'Title', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'category', label: 'Category' },
            { key: 'cover_label', label: 'Cover Label' },
            { key: 'cover_color', label: 'Cover Color' },
            { key: 'total_words', label: 'Total Words', type: 'number' },
        ]}
    />
);

export const AdminLessons = () => (
    <AdminCrudPage
        endpoint="lessons"
        title="Manage Lessons"
        columns={[
            { key: 'course_id', label: 'Course ID', type: 'number', required: true },
            { key: 'title', label: 'Title', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'order', label: 'Order', type: 'number' },
        ]}
    />
);

export const AdminVocabulary = () => (
    <AdminCrudPage
        endpoint="vocabulary"
        title="Manage Vocabulary"
        columns={[
            { key: 'lesson_id', label: 'Lesson ID', type: 'number', required: true },
            { key: 'word', label: 'Word', required: true },
            { key: 'phonetic', label: 'Phonetic' },
            { key: 'part_of_speech', label: 'Part of Speech' },
            { key: 'vietnamese', label: 'Vietnamese', required: true },
            { key: 'definition', label: 'Definition', type: 'textarea' },
            { key: 'audio_url', label: 'Audio URL' },
            { key: 'image_url', label: 'Image URL' }
        ]}
    />
);

export const AdminTopics = () => (
    <AdminCrudPage
        endpoint="topics"
        title="Manage Topics"
        columns={[
            { key: 'title', label: 'Title', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'icon', label: 'Icon' },
            { key: 'color', label: 'Color' },
            { key: 'total_words', label: 'Total Words', type: 'number' },
        ]}
    />
);

export const AdminSentences = () => (
    <AdminCrudPage
        endpoint="sentences"
        title="Manage Sentences"
        columns={[
            { key: 'content', label: 'Content', type: 'textarea', required: true },
            { key: 'vietnamese', label: 'Vietnamese', type: 'textarea' },
            { key: 'level', label: 'Level' },
            { key: 'topic', label: 'Topic' },
            { key: 'audio_url', label: 'Audio URL' },
            { key: 'order', label: 'Order', type: 'number' }
        ]}
    />
);

export const AdminDictationCollections = () => (
    <AdminCrudPage
        endpoint="dictation-collections"
        title="Manage Dictation Collections"
        columns={[
            { key: 'title', label: 'Title', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'icon', label: 'Icon' },
            { key: 'color', label: 'Color' },
            { key: 'order', label: 'Order', type: 'number' },
        ]}
    />
);

export const AdminDictationPassages = () => (
    <AdminCrudPage
        endpoint="dictation-passages"
        title="Manage Dictation Passages"
        columns={[
            { key: 'collection_id', label: 'Collection ID', type: 'number', required: true },
            { key: 'title', label: 'Title', required: true },
            { key: 'duration', label: 'Duration' },
            { key: 'total_sentences', label: 'Total Sentences', type: 'number' },
            { key: 'order', label: 'Order', type: 'number' },
        ]}
    />
);

export const AdminDictationExercises = () => (
    <AdminCrudPage
        endpoint="dictation-exercises"
        title="Manage Dictation Exercises"
        columns={[
            { key: 'passage_id', label: 'Passage ID', type: 'number', required: true },
            { key: 'sentence', label: 'Full Sentence', type: 'textarea', required: true },
            { key: 'before_blank', label: 'Before Blank' },
            { key: 'answer', label: 'Answer (Blank)', required: true },
            { key: 'after_blank', label: 'After Blank' },
            { key: 'vietnamese', label: 'Vietnamese', type: 'textarea' },
            { key: 'distractors', label: 'Distractors (Comma-separated)', type: 'textarea' },
            { key: 'order', label: 'Order', type: 'number' },
        ]}
    />
);

export const AdminGrammarUnits = () => (
    <AdminCrudPage
        endpoint="grammar-units"
        title="Manage Grammar Units"
        columns={[
            { key: 'title', label: 'Title', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'order', label: 'Order', type: 'number' },
        ]}
    />
);

export const AdminGrammarLessons = () => (
    <AdminCrudPage
        endpoint="grammar-lessons"
        title="Manage Grammar Lessons"
        columns={[
            { key: 'unit_id', label: 'Unit ID', type: 'number', required: true },
            { key: 'title', label: 'Title', required: true },
            { key: 'type', label: 'Type (theory | exercise)', required: true },
            { key: 'content', label: 'Markdown Content', type: 'textarea', required: true },
            { key: 'order', label: 'Order', type: 'number' },
        ]}
    />
);

export const AdminGrammarExercises = () => (
    <AdminCrudPage
        endpoint="grammar-exercises"
        title="Manage Grammar Exercises"
        columns={[
            { key: 'lesson_id', label: 'Lesson ID', type: 'number', required: true },
            { key: 'question', label: 'Question', type: 'textarea', required: true },
            { key: 'correct_answer', label: 'Correct Answer', type: 'text' },
            { key: 'explanation', label: 'Explanation', type: 'textarea' },
            { key: 'order', label: 'Order', type: 'number' },
        ]}
    />
);
