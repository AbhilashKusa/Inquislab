import { validatePassword, getPassword, buildJobFromForm } from '../lib/job-utils';

describe('Controller Authentication', () => {
  describe('validatePassword', () => {
    it('should throw error for invalid password', () => {
      expect(() => validatePassword('wrongpassword')).toThrow('Invalid controller password.');
    });

    it('should throw error for null password', () => {
      expect(() => validatePassword(null)).toThrow('Invalid controller password.');
    });

    it('should throw error for empty password', () => {
      expect(() => validatePassword('')).toThrow('Invalid controller password.');
    });

    it('should not throw for correct password', () => {
      expect(() => validatePassword(getPassword())).not.toThrow();
    });

    it('should not throw for password matching the constant', () => {
      expect(() => validatePassword('test-password-123')).not.toThrow();
    });
  });
});

describe('Job Form Building', () => {
  describe('buildJobFromForm', () => {
    it('should build a complete job object from form data', () => {
      const formData = new FormData();
      formData.set('title', 'Test Engineer');
      formData.set('team', 'Team 01 · Product Engineering');
      formData.set('location', 'Remote · India');
      formData.set('type', 'Full-time');
      formData.set('tag', 'Work with founder');
      formData.set('summary', 'Test summary');
      formData.set('secTitle1', 'Expect to focus on');
      formData.set('secBullets1', 'Task 1\nTask 2');
      formData.set('secTitle2', 'You may be a good fit if you');
      formData.set('secBullets2', 'Skill 1\nSkill 2');
      formData.set('secTitle3', 'InquisLab is for you if');
      formData.set('secBullets3', 'Reason 1\nReason 2');

      const job = buildJobFromForm(formData);

      expect(job.title).toBe('Test Engineer');
      expect(job.id).toBe('test-engineer');
      expect(job.team).toBe('Team 01 · Product Engineering');
      expect(job.location).toBe('Remote · India');
      expect(job.type).toBe('Full-time');
      expect(job.tags).toEqual(['Work with founder']);
      expect(job.summary).toBe('Test summary');
      expect(job.sections).toHaveLength(3);
      expect(job.sections[0].title).toBe('Expect to focus on');
      expect(job.sections[0].bullets).toEqual(['Task 1', 'Task 2']);
      expect(job.sections[1].title).toBe('You may be a good fit if you');
      expect(job.sections[1].bullets).toEqual(['Skill 1', 'Skill 2']);
      expect(job.sections[2].title).toBe('InquisLab is for you if');
      expect(job.sections[2].bullets).toEqual(['Reason 1', 'Reason 2']);
    });

    it('should generate id from title with slugification', () => {
      const formData = new FormData();
      formData.set('title', 'Senior Software Engineer!');

      const job = buildJobFromForm(formData);

      expect(job.id).toBe('senior-software-engineer');
    });

    it('should handle special characters in title for id generation', () => {
      const formData = new FormData();
      formData.set('title', 'Full-Stack Developer (React/Node)');

      const job = buildJobFromForm(formData);

      expect(job.id).toBe('full-stack-developer-react-node');
    });

    it('should use default values for missing fields', () => {
      const formData = new FormData();

      const job = buildJobFromForm(formData);

      expect(job.title).toBe('New Role');
      expect(job.id).toBe('new-role');
      expect(job.team).toBe('Team 01 · Product Engineering');
      expect(job.location).toBe('Remote · India');
      expect(job.type).toBe('Full-time');
      expect(job.tags).toEqual(['Work with founder']);
    });

    it('should set apply email and subject correctly', () => {
      const formData = new FormData();
      formData.set('title', 'Test Role');

      const job = buildJobFromForm(formData);

      expect(job.applyEmail).toBe('careers@inquislab.com');
      expect(job.applySubject).toBe('Test Role — Application');
    });

    it('should handle empty sections by filtering them out', () => {
      const formData = new FormData();
      formData.set('title', 'Test Role');
      formData.set('secTitle1', 'Expect to focus on');
      formData.set('secBullets1', ''); // No responsibilities
      // No secTitle2 or secBullets2 either

      const job = buildJobFromForm(formData);

      expect(job.sections).toHaveLength(0);
    });

    it('should handle multi-line input with empty lines', () => {
      const formData = new FormData();
      formData.set('title', 'Test');
      formData.set('secTitle1', 'Expect to focus on');
      formData.set('secBullets1', 'Task 1\n\nTask 2\n\n\nTask 3');

      const job = buildJobFromForm(formData);

      expect(job.sections[0].bullets).toEqual(['Task 1', 'Task 2', 'Task 3']);
    });

    it('should preserve existing id in edit mode', () => {
      const formData = new FormData();
      formData.set('id', 'existing-job-id');
      formData.set('title', 'New Title');

      const job = buildJobFromForm(formData);

      expect(job.id).toBe('existing-job-id');
    });

    it('should support Marketing & Growth team', () => {
      const formData = new FormData();
      formData.set('title', 'Growth Lead');
      formData.set('team', 'Team 02 · Marketing & Growth');

      const job = buildJobFromForm(formData);

      expect(job.team).toBe('Team 02 · Marketing & Growth');
    });
  });
});
