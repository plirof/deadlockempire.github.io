var levels = {
	"test": new Level(
	    "test",
	    "Test Level",
		"In this level, you slay monsters.",
		"You have won.",
		[
			new Thread([
				new Instruction("Hello World!"),
				new ExpandableInstruction("do something really complex", [
					new Instruction("do"),
					new Instruction("something"),
					new Instruction("really"),
					new Instruction("rather"),
					new Instruction("complex"),
				]),
				new Instruction("and now"),
				new Instruction("something simple"),
				new ExpandableInstruction("and something complex", [
					new Instruction("and"),
					new Instruction("something"),
					new Instruction("complex"),
				]),
			]),
			new Thread([
				new AssignInstruction("global hello = 'world'", 'hello', 'String', 'world'),
				new Instruction("foo"),
				new Instruction("  bar"),
				new Instruction("  zoo"),
				new WinningInstruction("[REACH THIS TO WIN]")
			]),
			new Thread([
				new Instruction("bar"),
				new AssignInstruction("global hello = 'foo'", 'hello', 'String', 'foo'),
				new WinningInstruction("[OR REACH THIS TO WIN]"),
				new Instruction("foo"),
				new Instruction("bar"),
			])
		]),
	"tutorial": new Level(
	    "tutorial",
		"Tutorial Level",
		"We don't have enough instructions.",
		"You have learnt no lesson here.",
		[
			new Thread([
				new Instruction("This is the single-thread tutorial.")
			])
		]),
	"criticalSectionTest": new Level(
		"criticalSectionTest",
		"Critical Section Test",
		"This is short description.",
		"This is victory lesson.",
		[
			new Thread([
				new Instruction("This does nothing."),
				new CriticalSectionInstruction()
			]),
			new Thread([
			new Instruction("This does nothing."),
			new CriticalSectionInstruction()
			])

		]),
	"semaphoreTest": new Level(
		"semaphoreTest",
		"Semaphore Test",
		"DESC",
		"VCIT",
		[
			new Thread([
				new SemaphoreReleaseInstruction("ss"),
				new SemaphoreReleaseInstruction("ss"),
				new SemaphoreWaitInstruction("ss"),
				new CriticalSectionInstruction(),
				new SemaphoreReleaseInstruction("ss")
			]), new Thread([
				new SemaphoreWaitInstruction("ss"),
				new CriticalSectionInstruction(),
				new SemaphoreReleaseInstruction("ss")
			])
		],
		{
			"ss": {
				"name" : "ss",
				"type" : "System.Threading.SemaphoreSlim",
				"value" : 0
			}
		}
		),
	"infiniteLevel": new Level(
		"infiniteLevel",
		"Infinite Level",
		"DESC",
		"VICTORY",
		[
			new Thread([
				new WhileInstruction("true", function() { return true; }, "eternal"),
				new FlavorInstruction("business_logic()"),
				new EndWhileInstruction("eternal")
			])
		]
	),
	"deadlock": new Level(
		"deadlock",
		"Simple Deadlock",
		"You must cause a deadlock.",
		"Yay. A deadlock!",
		[
			new Thread([
				new MonitorEnterInstruction("mutex"),
				new MonitorEnterInstruction("mutex2"),
				new CriticalSectionInstruction(),
				new MonitorExitInstruction("mutex"),
				new MonitorExitInstruction("mutex2"),
			]),
			new Thread([
				new MonitorEnterInstruction("mutex2"),
				new MonitorEnterInstruction("mutex"),
				new CriticalSectionInstruction(),
				new MonitorExitInstruction("mutex2"),
				new MonitorExitInstruction("mutex"),
			]),
		],
		{
			"mutex" : {
				name: "mutex",
				type: "System.Object",
				value: "unimportant",
				"lockCount": 0,
				"lastLockedByThread": null,
			},
			"mutex2" : {
				name: "mutex2",
				type: "System.Object",
				value: "unimportant",
				"lastLockedByThread": null,
				"lockCount": 0
			}
		}
	),
	"1-simpletest": new Level(
		"1-simpletest",
		"Simple Test",
		"Learn to step through a program in the Thread Safety Breaker in this tutorial level. Simply keep stepping forwards until you reach the failure statement to win.",
		"The failure statement is like an 'assert false' statement. It represents a point in the program that should never be reached or the program was incorrectly programmed. In this game, reaching a failure statement always results in immediate victory.",
		[
			new Thread([
				createAssignment("a", new LiteralExpression(1)),
				createAssignment("a",
					new AdditionExpression(new VariableExpression("a"),
					new LiteralExpression(2))),
				new IfInstruction(new EqualityExpression(new VariableExpression("a"), new LiteralExpression(3)), "if"),
				new FailureInstruction(),
				new EndIfInstruction("}", "if")
			])
		],
		{
			"a" : {
				name : "a",
				type : "System.Int32",
				value : 0
			}
		}
	),
	"3-simpleCounter" : new Level(
		"3-simpleCounter",
		"Simple Counter",
		"Here also you must make both threads enter the critical section. This should not be hard.",
		"As you have seen, once you pass a test, such as an integer comparison, you don't care about what other threads do to the operands - you have already passed the test and may continue to the critical section. To make this work, you would need locks.",
		[
			new Thread([
				new WhileInstruction(new LiteralExpression(true), "while"),						createIncrement("counter"),
				new IfInstruction(new EqualityExpression(new VariableExpression("counter"), new LiteralExpression(5)), "if"),
				new CriticalSectionInstruction(),
				new EndIfInstruction("if"),
				new EndWhileInstruction("while")
			]),
			new Thread([
				new WhileInstruction(new LiteralExpression(true), "while"), 				createIncrement("counter"),
				new IfInstruction(new EqualityExpression(new VariableExpression("counter"), new LiteralExpression(3)), "if"),
				new CriticalSectionInstruction(),
				new EndIfInstruction("if"),
				new EndWhileInstruction("while")
			])
		],
		{
			"counter": {
				name: "counter",
				type: "System.Int32",
				value : 0
			}
		}
	),
	"4-confusedCounter" : new Level(
		"4-confusedCounter",
		"Confused Counter",
		"Could it be that some instructions are hidden from sight?",
		"Most instructions are <i>not</i> atomic. That means that context may switch during the instruction's execution. For assignments, for example, it means that the expression may be read into registers of a thread, but then context may switch and when the thread receives priority again, it won't read the expression again, it will simply write the register into the left-hand variable.",
		[
			new Thread([
				new FlavorInstruction("business_logic()"),
				createIncrement("first"),
				createIncrement("second"),
				new IfInstruction(new AndExpression(
					new EqualityExpression(new VariableExpression("second"), new LiteralExpression(2)),
					new InequalityExpression(new VariableExpression("first"), new LiteralExpression(2))), "if"),
				new FailureInstruction(),
				new EndIfInstruction("if")
			]),
			new Thread([
				new FlavorInstruction("business_logic()"),
				createIncrement("first"),
				createIncrement("second"),
				new IfInstruction(new AndExpression(
					new EqualityExpression(new VariableExpression("second"), new LiteralExpression(2)),
					new InequalityExpression(new VariableExpression("first"), new LiteralExpression(2))), "if"),
				new FailureInstruction(),
				new EndIfInstruction("if")
			])
		],
		{
			"first": {
				name: "first",
				type: "System.Int32",
				value : 0
			},
			"second": {
				name: "second",
				type: "System.Int32",
				value : 0
			}
		}
	),

};
